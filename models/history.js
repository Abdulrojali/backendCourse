const mongoose = require("mongoose");
// model history for admin 
const historyCreateCourseSchema = new mongoose.Schema({
  id_course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
  snapShoot:{
    name:String,
  },
  Author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  date: { type: Date, default: Date.now },
  actions:{type:String}
});

const historyDeleteCourseSchema = new mongoose.Schema({
  id_course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
  snapShoot:{
    name:String,
  },
  Author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  date: { type: Date, default: Date.now },
   actions:{type:String}
});

const historyUpdateCourseSchema = new mongoose.Schema({
  id_course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
  snapShoot:{
    name:String,
  },
  Author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  date: { type: Date, default: Date.now },
   actions:{type:String}
});


// models history for user 
const historyEditProfileSchema = new mongoose.Schema({
users:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
tanggalEdit:{ type: Date, default: Date.now }
})


const historyLikeCourseSchema = new mongoose.Schema({
    users:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  AllCourseLikeByUser:[{type: mongoose.Schema.Types.ObjectId, ref: 'Courses'}],
  tanggalLike: { type: Date, default: Date.now },
})

const historyJoinCourseSchema = new mongoose.Schema({
  users:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseJoin:[{type: mongoose.Schema.Types.ObjectId, ref: 'Courses'}],
  tanggal: { type: Date, default: Date.now },
})

const WatchedCourseSchema= new mongoose.Schema({
  users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  dataWatch: [
    {
      video: { type: mongoose.Schema.Types.ObjectId, ref: "dataVideo" },
      status: { type: String, enum: ["sudah nonton", "belum nonton"], default: "belum nonton" },
      lastWatchedAt: { type: Date, default: Date.now },
    },
  ],
  tanggal: { type: Date, default: Date.now },
})

module.exports = mongoose.model("HistoryCreateCourse", historyCreateCourseSchema);
module.exports = mongoose.model("HistoryDeleteCourse", historyDeleteCourseSchema);
module.exports = mongoose.model("HistoryUpdateCourse", historyUpdateCourseSchema);
module.exports=mongoose.model('HistoryWatchedCourse',WatchedCourseSchema)



module.exports=mongoose.model('HistoryJoinCourse',historyJoinCourseSchema)
module.exports=mongoose.model('HistoryLikeCourse',historyLikeCourseSchema)
module.exports=mongoose.model('HistoryEditProfile',historyEditProfileSchema)
