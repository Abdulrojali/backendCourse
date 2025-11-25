const mongoose = require('mongoose')
const detailProfileUserSchema = new mongoose.Schema({
  contact:{type:String,default:''},
  sosialmedia:{type:String,default:''},
  jobs:{type:String,default:''},
  usersRelations:{type:mongoose.Types.ObjectId, ref:'User'}
})

module.exports=mongoose.model('detailProfileUser',detailProfileUserSchema)