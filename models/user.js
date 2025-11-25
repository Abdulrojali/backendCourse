// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  imgProfile:{type:String,default:''},
  idpublickImgProfile:{type:String,default:''},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
    extra: { type: mongoose.Schema.Types.Mixed },
});

module.exports =mongoose.model("User", userSchema)

