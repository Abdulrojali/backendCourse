// const {HistoryCreateCourse,HistoryDeleteCourse,HistoryUpdateCourse}=require('../models/history.js')
const mongoose = require('../models');

const Course = mongoose.model('Courses')
const HistoryCreateCourse=mongoose.model('HistoryCreateCourse')
const HistoryDeleteCourse=mongoose.model('HistoryDeleteCourse')
const HistoryUpdateCourse=mongoose.model('HistoryUpdateCourse')
const HistoryWatchedCourse=mongoose.model("HistoryWatchedCourse")
const responseHandler = require("../utilis/handlerStatus.js");


const historyCreate=async(req,res)=>{
try {

    const dataInSnappShot = await HistoryCreateCourse
      .find({}).populate('id_course')
      .sort({ date: -1 })
      .limit(1);
      
    res.status(200).json(dataInSnappShot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const historyDelete=async(req,res)=>{
  try {
    const data = await HistoryDeleteCourse
         .find({}).populate('id_course')
      .sort({ date: -1 })
      .limit(1)
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


const historyUpdate=async(req,res)=>{
     try {
    const data = await HistoryUpdateCourse
      .find({}).populate('id_course')
      .sort({ date: -1 })
      .limit(1)
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

const getLatestHistory = async (req, res) => {
  try {
    const [latestCreate, latestUpdate, latestDelete] = await Promise.all([
      HistoryCreateCourse.findOne().populate('id_course Author').sort({ date: -1 }),
      HistoryUpdateCourse.findOne().populate('id_course Author').sort({ date: -1 }),
      HistoryDeleteCourse.findOne().populate('id_course Author').sort({ date: -1 })
    ]);

    // ubah ke format seragam dengan properti 'tanggal' dan 'type'
    const histories = [];

    if (latestCreate) histories.push({
      type: 'create',
      tanggal: latestCreate.date,
      data: latestCreate
    });

    if (latestUpdate) histories.push({
      type: 'update',
      tanggal: latestUpdate.date,
      data: latestUpdate
    });

    if (latestDelete) histories.push({
      type: 'delete',
      tanggal: latestDelete.date,
      data: latestDelete
    });

    // urutkan descending (paling baru di atas)
    histories.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    res.json(histories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data history terbaru', error });
  }
};

const getHistoryByAdmin=async(req,res)=>{
  try{
    const {id}= req.params 
    const historycreate= await HistoryCreateCourse.find({Author:id}).populate('Author').populate('id_course')
    const historydelete= await HistoryDeleteCourse.find({Author:id}).populate('Author').populate('id_course')
    const historyupdate= await HistoryUpdateCourse.find({Author:id}).populate('Author').populate('id_course')
    // const datas=[{type:'create',historycreate},{type:'delete',historydelete},{type:'update',historyupdate}]
    const datas= [historycreate,historydelete,historyupdate]
    res.status(200).send(datas)
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"gagal mengambil data history berdasarkan id admin",err})
  }
}


const getHistoryWatchVideoByIdUserAndCourse=async(req,res)=>{
  try{
     const idUser = new mongoose.Types.ObjectId(req.user.id);
    const getHistoryWatchByIdUser=await HistoryWatchedCourse.find({users:idUser}).populate('course')
    if(!getHistoryWatchByIdUser){
      return responseHandler.badRequest(res,'failed get history watch ')
    }
    else{
      return responseHandler.success(res,'sukses get history watch course by id user',getHistoryWatchByIdUser)
    }
  }
  catch(err){
    return responseHandler.serverError(res,err)
  }
}



module.exports={historyCreate,historyDelete,historyUpdate,getLatestHistory,getHistoryByAdmin,getHistoryWatchVideoByIdUserAndCourse}