const mongoose = require('../models');

const Admin = mongoose.model('Admin')
const jwt =require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {generateAccessToken,generateRefreshToken}=require('../utilis/generateToken')
const {cloudinary} = require('../config/coludinary.js')
const fs= require('fs')
const getDataAdmin=async (req,res)=>{
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
 const profileAdmin=async(req,res)=>{
  try{
    const {id}= req.params
    const dataAdmin= await Admin.findById(id).select({password:0})
    if(!dataAdmin){res.status(301).send('invalid get admin by id')}
    res.status(200).json(dataAdmin)
  }
 catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const editProfileAdmin=async(req,res)=>{
  try{
    const {id}=req.params
    const {name,username,password,email}=req.body
    
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
           folder: "courses/img",
         });
     
              const saltRounds = 10; 
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         fs.unlinkSync(req.file.path);
        const dataAdmin=  await Admin.findByIdAndUpdate(id,{
            nameadmin:name,
            username:username,
            password:hashedPassword,
            email:email,
            urlImg:result.secure_url,
            idImg:result.public_id
          },{new:true, strict:false})
     if(!dataAdmin){res.status(300).send('invalid get match id')}
     
    await dataAdmin.save()
     res.status(200).send('sukses edit profile')
  }
catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createAdmin=async(req,res)=>{
  try {
    const {nama,username,password,email}= req.body
    const roles='admin'
    if(!nama && !username && !password && !email){
      return res.status(301).send('not found request body!!')
    }
    const newAdmin = new Admin({nameadmin:nama,username:username,password:password,email:email,extra:roles});
    await newAdmin.save();
    res.status(200).json(newAdmin);
  } catch (err) {
      if (err.code === 11000) {
    console.log("❌ nama,username,password, atau email sudah dipakai!");
  } else {
    console.log("Error lain:", err);
  }
    res.status(400).json({ error: err.message });
    console.log(err)
  }
}

const updateDataAdmin=async(req,res)=>{
    try {
    const updated = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const deleteDataAdmin=async(req,res)=>{
    try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const loginAdmin=async(req,res)=>{
  try{
     const { username, password } = req.body;
      if (!username && !password) {
      return res.status(400).json({massage:"not found input!!"});
    }
    
 const filterUsername = await Admin.findOne({ username: username });
    const filterPassword = bcrypt.compareSync(password, filterUsername.password);

    if (filterUsername && filterPassword) {
      const datas = { name:filterUsername.nameadmin, id: filterUsername._id, roles:filterUsername.extra};
      const accessToken=generateAccessToken(datas)
      const refreshToken = generateRefreshToken(datas)
// simpan di cookie 
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Kirim access token ke frontend
   res.status(200).json({ accessToken,id:filterUsername._id });
 }
 else if(!filterUsername){
  return res.status(404).json({massage:"username invalid"})
 }
 else if(!filterPassword){
  return res.status(404).json({massage:"password invalid"})
 }
 else{
  return res.status(404).json({massage:"data tidak di temukan"})
 }
}
  catch(err){
    res.status(500).json({message:err.message})
  }
}

const refreshToken=async(req,res)=>{
  try{
      const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
   jwt.verify(refreshToken, process.env.refresh_key, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Payload user hasil dari decode refresh token
    const payload = {
      name:decoded.name,
      id: decoded.id,
      roles: decoded.roles,
    };

    // Buat access token baru
    const newAccessToken = jwt.sign(payload, process.env.access_key, {
      expiresIn: "15m",
    });

    // Kirim access token baru
    res.json({ accessToken: newAccessToken });
  });
  }
  catch(err){
  res.status(400).json({message:err.message})
  }
}

module.exports = {deleteDataAdmin,updateDataAdmin,createAdmin,getDataAdmin,loginAdmin,refreshToken, profileAdmin, editProfileAdmin };
