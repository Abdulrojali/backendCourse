const cloudinaryUtils = require("../utilis/cloudinary.js");
const fs = require("fs");
const mongoose = require("../models");
const responseHandler = require("../utilis/handlerStatus.js");

const Course = mongoose.model("Courses");
const dataVideo = mongoose.model("dataVideo");
const HistoryWatchedCourse = mongoose.model('HistoryWatchedCourse')

// === Tambah video baru (akses admin) ===
const addVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desk } = req.body;

    if (!title || !desk) {
      return responseHandler.badRequest(res, "Title and deskripsi are required!");
    }

    // Upload ke Cloudinary pakai utilitas
    const result = await cloudinaryUtils.upload(req.file.path, "courses/videos", "video");

    const newVideo = new dataVideo({
      srcVideo: result.url,
      public_id_video: result.public_id,
      tittle: title,
      deskripsi: desk,
    });
    await newVideo.save();

    const addNewVideoCourse = await Course.findByIdAndUpdate(
      id,
      { $push: { videos: newVideo._id } },
      { new: true, useFindAndModify: false }
    );

    if (!addNewVideoCourse) {
      return responseHandler.badRequest(res, "Failed to add new video to course");
    }

    return responseHandler.success(res, `Sukses add new video by ${id}`, addNewVideoCourse);
  } catch (err) {
    return responseHandler.serverError(res, "Invalid add new video", err);
  }
};

// === Update video (akses admin) ===
const updateVideoCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desk } = req.body;

    if (!title || !desk) {
      return responseHandler.badRequest(res, "Title and desk are required!");
    }

    const video = await dataVideo.findById(id);
    if (!video) {
      return responseHandler.notFound(res, "Video not found");
    }

    // Hapus video lama dari Cloudinary
    await cloudinaryUtils.delete(video.public_id_video, "video");

    // Upload video baru
    const newDataVideo = await cloudinaryUtils.upload(req.file.path, "courses/videos", "video");

    // Update data di database
    video.srcVideo = newDataVideo.url;
    video.public_id_video = newDataVideo.public_id;
    video.tittle = title;
    video.deskripsi = desk;

    await video.save();

    return responseHandler.success(res, "Sukses update video course", video);
  } catch (err) {
    return responseHandler.serverError(res, "Invalid update video course", err);
  }
};

// === Ambil seluruh video ===
const getVideo = async (req, res) => {
  try {
    const getDataVideo = await dataVideo.find();
    if (!getDataVideo || getDataVideo.length === 0) {
      return responseHandler.notFound(res, "No videos found");
    }

    return responseHandler.success(res, "Sukses get video", getDataVideo);
  } catch (err) {
    return responseHandler.serverError(res, "Failed get video", err);
  }
};

// === Ambil video berdasarkan ID course ===
const getVideoByIdCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const getAllVideoByIdCourse = await Course.findOne({ _id: id }).populate("videos");
    return responseHandler.success(res, "Sukses ambil video berdasarkan id", getAllVideoByIdCourse);
  } catch (err) {
    return responseHandler.serverError(res, "Gagal menemukan video", err);
  }
};

// === Delete video (akses admin) ===
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await dataVideo.findById(id);
    if (!video) {
      return responseHandler.notFound(res, "Video not found");
    }

    // Hapus dari Cloudinary
    await cloudinaryUtils.delete(video.public_id_video, "video");

    // Hapus dari database
    await dataVideo.findByIdAndDelete(id);

    return responseHandler.success(res, "Sukses delete video");
  } catch (err) {
    return responseHandler.serverError(res, "Invalid delete video", err);
  }
};

// === Update status video ===

// belum selesai 
// 1. CARI DATA HISTORY WATCH YANG SESUAI DENGAN USERS DAN COURSEWATCH 
// 2. MASUK KEDALAM FINDIDvIDEO BUAT KONDISI APAKAH dataWatch ada atau tidak? lalu apakah data terkait video dari course tersebut sudah selesai semua?
// jika sudah jangan push data baru ke datawatch. tapi lanjutkan video course yang belum selesai dan daftarkan ke datawatch
const updateStatusVideo = async (req, res) => {
  try {
    const { id } = req.params;       // id video
    const { idCourse } = req.body;   // id course
    const idUser = new mongoose.Types.ObjectId(req.user.id);

    const history = await HistoryWatchedCourse.findOne({
      users: idUser,
      course: idCourse,
    });

    if (history) {
      // Cari video di dalam dataWatch
      const videoData = history.dataWatch.find(
        (data) => data.video.toString() === id
      );

      // Jika video sudah pernah ditonton
      if (videoData && videoData.status === 'sudah nonton') {
        return responseHandler.success(
          res,
          "anda sudah menonton video ini",
          history
        );
      }

      // Jika belum ada video ini dalam dataWatch, tambahkan
      if (!videoData) {
        const updatedHistory = await HistoryWatchedCourse.findOneAndUpdate(
          { users: idUser, course: idCourse },
          { $push: { dataWatch: { video: id, status: 'sudah nonton' } } },
          { new: true }
        );

        return responseHandler.success(
          res,
          "sukses update status video in history watch",
          updatedHistory
        );
      }

      // Jika video ada tapi status belum 'sudah nonton', update status-nya
      const updatedHistory = await HistoryWatchedCourse.findOneAndUpdate(
        { users: idUser, course: idCourse, "dataWatch.video": id },
        { $set: { "dataWatch.$.status": "sudah nonton" } },
        { new: true }
      );

      return responseHandler.success(
        res,
        "berhasil update status video menjadi 'sudah nonton'",
        updatedHistory
      );
    }

    // Jika belum ada history sama sekali
    return responseHandler.badRequest(res, "data history tidak ditemukan");

  } catch (err) {
    return responseHandler.serverError(res, "Invalid update status video", err);
  }
};




module.exports = {
  addVideo,
  updateVideoCourse,
  getVideo,
  getVideoByIdCourse,
  deleteVideo,
  updateStatusVideo,
};
