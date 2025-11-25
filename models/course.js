// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  namecourse: { type: String, required: true },
  urlimg: { type: String },
  idPublicImg:{type:String},
  anggota: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // user yang ikut course
  deskripsi: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // admin pembuat
  videos:[{type:mongoose.Schema.Types.ObjectId,ref:'dataVideo'}]
});

const courseRatingsSchema= new mongoose.Schema({
       course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
      rating: { type: Number, min: 1, max: 5 },
      tanggalRatting:{ type: Date, default: Date.now},
})

module.exports=mongoose.model('Courses',courseSchema)
module.exports=mongoose.model('courseRattings',courseRatingsSchema)


