const mongoose = require("mongoose");
const datavideoSchema= mongoose.Schema({
    srcVideo:{type:String},
    public_id_video:{type:String},
    tittle:{type:String},
    deskripsi:{type:String},
})

module.exports=mongoose.model('dataVideo',datavideoSchema)