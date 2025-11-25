// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  nameadmin: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   extra: { type: mongoose.Schema.Types.Mixed },
},{ strict: false } );
 
module.exports =mongoose.model("Admin", adminSchema)
