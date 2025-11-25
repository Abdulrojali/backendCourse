const cloudinaryUtils = require("../utilis/cloudinary.js");
const fs = require("fs");
const mongoose = require("../models");
const responseHandler = require("../utilis/handlerStatus.js");
const course = require("../models/course.js");

const Course = mongoose.model("Courses");
const HistoryCreateCourse = mongoose.model("HistoryCreateCourse");
const HistoryDeleteCourse = mongoose.model("HistoryDeleteCourse");
const HistoryUpdateCourse = mongoose.model("HistoryUpdateCourse");
const HistoryJoinCourse = mongoose.model("HistoryJoinCourse");
const HistoryEditProfile = mongoose.model("HistoryEditProfile");
const HistoryLikeCourse = mongoose.model("HistoryLikeCourse");
const dataVideo = mongoose.model("dataVideo");
const HistoryWatchedCourse=mongoose.model("HistoryWatchedCourse")
// ==============================================
// 1️⃣ All role access
// ==============================================
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const findCourseById = await Course.findById(id).populate("createdBy");

    if (!findCourseById) {
      return responseHandler.notFound(res, "Course not found");
    }

    return responseHandler.success(res, "Sukses get course by ID", findCourseById);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal mendapatkan course by ID", err);
  }
};

const getCourse = async (req, res) => {
  try {
    const allCourse = await Course.find();
    if (!allCourse || allCourse.length === 0) {
      return responseHandler.notFound(res, "Tidak ada course ditemukan");
    }
    return responseHandler.success(res, "Sukses get semua course", allCourse);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal get semua course", err);
  }
};

// ==============================================
// 2️⃣ Admin access only
// ==============================================
const getCourseByAdmin = async (req, res) => {
  try {
    const dataCourse = await Course.find();
    return responseHandler.success(res, "Sukses get data course by admin", dataCourse);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal get data course by admin", err);
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, desk } = req.body;
    const idAdmin = req.user.id;

    if (!name || !desk) {
      return responseHandler.badRequest(res, "Nama dan deskripsi wajib diisi");
    }
    if (!req.file) {
      return responseHandler.badRequest(res, "Harap upload gambar course");
    }

    // Upload gambar ke Cloudinary
    const result = await cloudinaryUtils.upload(req.file.path, "courses/img", "image");

    const newCourse = new Course({
      namecourse: name,
      urlimg: result.url,
      idPublicImg: result.public_id,
      deskripsi: desk,
      createdBy: idAdmin,
    });

    await newCourse.save();

    // Simpan riwayat pembuatan course
    const newHistory = new HistoryCreateCourse({
      id_course: newCourse._id,
      snapShoot: { name: newCourse.namecourse },
      Author: idAdmin,
      actions: "create",
    });
    await newHistory.save();

    return responseHandler.created(res, "Sukses membuat course baru", newCourse);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal membuat course", err);
  }
};

const editCourse = async (req, res) => {
  try {
    const { newName, newDeskripsi } = req.body;
    const { id } = req.params;
    const updateByIdAdmin = req.user.id;

    if (!newName || !newDeskripsi) {
      return responseHandler.badRequest(res, "Nama dan deskripsi baru wajib diisi");
    }
    if (!req.file) {
      return responseHandler.badRequest(res, "Harap upload gambar baru");
    }

    const oldData = await Course.findById(id);
    if (!oldData) {
      return responseHandler.notFound(res, "Course tidak ditemukan");
    }

    // Hapus gambar lama di Cloudinary
    await cloudinaryUtils.delete(oldData.idPublicImg, "image");

    // Upload gambar baru
    const updatedImg = await cloudinaryUtils.upload(req.file.path, "courses/img", "image");

    // Update data course
    oldData.namecourse = newName;
    oldData.deskripsi = newDeskripsi;
    oldData.urlimg = updatedImg.url;
    oldData.idPublicImg = updatedImg.public_id;
    oldData.createdBy = updateByIdAdmin;

    await oldData.save();

    // Simpan history update course
    const updateHistory = new HistoryUpdateCourse({
      id_course: id,
      snapShoot: { name: oldData.namecourse },
      Author: updateByIdAdmin,
      actions: "update",
    });
    await updateHistory.save();

    return responseHandler.success(res, "Sukses update course", oldData);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal update course", err);
  }
};

const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("videos");

    if (!course) {
      return responseHandler.notFound(res, "Course tidak ditemukan");
    }

    // Hapus gambar utama di Cloudinary
    if (course.idPublicImg) {
      await cloudinaryUtils.delete(course.idPublicImg, "image");
    }

    // Hapus semua video dari Cloudinary dan database
    if (course.videos && course.videos.length > 0) {
      await Promise.all(
        course.videos.map(async (video) => {
          if (video.public_id_video) {
            await cloudinaryUtils.delete(video.public_id_video, "video");
          }
          await dataVideo.findByIdAndDelete(video._id);
        })
      );
    }

    // Simpan riwayat delete course
    const newHistoryDelete = new HistoryDeleteCourse({
      id_course: id,
      snapShoot: { name: course.namecourse },
      Author: req.user.id,
      actions: "delete",
    });
    await newHistoryDelete.save();

    await Course.findByIdAndDelete(id);

    return responseHandler.success(res, "Sukses delete course");
  } catch (err) {
    return responseHandler.serverError(res, "Gagal delete course", err);
  }
};

const getPopularCourse=async(req,res)=>{
 try {
    const result = await Course.aggregate([
      {
        $addFields: {
          jumlahAnggota: { $size: { $ifNull: ["$anggota", []] } }
        }
      },
      {
        $sort: { jumlahAnggota: -1 } // urutkan descending
      },
      {
        $limit: 3 // ambil hanya yang terbanyak
      },
      {
        $lookup: {
          from: "users",              // nama koleksi user
          localField: "anggota",
          foreignField: "_id",
          as: "anggotaDetail"
        }
      },
      {
        $lookup: {
          from: "admins",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      {
        $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true }
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Tidak ada course ditemukan" });
    }

    return res.status(200).json({
      message: "Course dengan anggota terbanyak berhasil diambil",
      data: result[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
}

const getDailyActivityNow =async (req,res)=>{
  try{
     const user = req.user;
const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query data berdasarkan tanggal hari ini
    const activities = await HistoryWatchedCourse.find({tanggal: { $gte: startOfDay, $lte: endOfDay } }).populate('course','namecourse').populate("dataWatch.video","tittle") // opsional, kalau mau ikut tampilkan user.lean();

      return responseHandler.success(res,'sukses get daily activity',activities)
  }
  catch(err){
return responseHandler.serverError(res, "Gagal get popular course", err);
  }
}

// ==============================================
// 3️⃣ User access only
// ==============================================

// masih di perbaikin di newhistorywatch dan new history join
const userJoinCourse = async (req, res) => {
  try {
    const { id } = req.params; // id course
    const user = req.user;



        // 🔍 Cek apakah course ada
    const course = await Course.findById(id);
    if (!course) {return responseHandler.notFound(res, "Course tidak ditemukan");}

    const sudahJoin = course.anggota.some(id => id.toString() === user.id);
    // 🔍 Cek apakah user sudah join course ini
    if (sudahJoin) {
              // 🔍 Cek apakah user sudah punya history join / watch
    const historyWatch = await HistoryWatchedCourse.findOne({ users: user.id });
    const historyJoin = await HistoryJoinCourse.findOne({ users: user.id });
      if(historyJoin && historyWatch){
        return responseHandler.success(res,'user sudah join course')
      }
      if(!historyJoin){
        await HistoryJoinCourse.create({
          users:user.id,
          courseJoin:id
        })
      }
      if(!historyWatch){
        await HistoryWatchedCourse.create({
          users:user.id,
          course:id
        })
      }
      return responseHandler.success(res,'history sudah pernah dibuat')
    }
     


    // 🧩 Tambahkan user ke anggota course
    await Course.findByIdAndUpdate(
      id,
      { $push: { anggota: user.id } },
      { new: true, useFindAndModify: false }
    );
    await HistoryWatchedCourse.create({
      users:user.id,
      course:id
    })
        await HistoryJoinCourse.create({
      users:user.id,
      courseJoin:id
    })

        return responseHandler.success(res, "sukses join course");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return responseHandler.error(res, "Terjadi kesalahan pada server", error);
  }
};






// controllers ini masih dalam perbaikan
const getVideoByUserJoinCourse=async (req,res)=>{
  try{
    const {id} = req.params
          const getCourseByidUserJoin = await Course.find({anggota:id}).populate('anggota')
      return responseHandler.success(res,'sukses get join course by id user',getCourseByidUserJoin)
  }
  catch(err){
    return responseHandler.serverError(res, "Failed get course join by user id", err);
  }
}

module.exports = {
  getCourse,
  getCourseByAdmin,
  getCourseById,
  createCourse,
  editCourse,
  deleteCourseById,
  getPopularCourse,
  getDailyActivityNow,
  userJoinCourse,
  getVideoByUserJoinCourse
};
