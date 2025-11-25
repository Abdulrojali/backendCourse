const mongoose = require('../models');

const User = mongoose.model('User')
const detailProfileUser=mongoose.model('detailProfileUser')


const jwt =require('jsonwebtoken');
const {generateAccessToken,generateRefreshToken}=require('../utilis/generateToken')
const bcrypt=require('bcrypt');
const { sanitizeDataInput,validateEmail } = require('../utilis/sanitize');
const {cloudinary} = require('../config/coludinary.js')
const fs = require('fs')

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {nama,username,password,email } = req.body;
    const roles= 'user'
    const newUser = new User({ name:nama,username:username,password:password, email:email,extra:roles});
    console.log(nama)
    await newUser.save();
    const newProfile = new detailProfileUser({
      usersRelations:newUser._id,
    })
    await newProfile.save()
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginUser=async(req,res)=>{
 try {
    const { username, password } = req.body;
    const filterUsername = await User.findOne({ username: username });
    const filterPassword = bcrypt.compareSync(password, filterUsername.password);
    if (filterUsername && filterPassword) {
      const datas = { name:filterUsername.name, id: filterUsername._id, roles:filterUsername.extra};
               const accessToken=generateAccessToken(datas)
               const refreshToken=generateRefreshToken(datas)
          
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
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

const logout=async(req,res)=>{
  try{
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true, // hanya https
      sameSite: 'none',
        path: '/', 
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  }
  catch(err){
    res.status(400).send(err)
  }
}

const editProfileUser=async(req,res)=>{
  try{
    const {contact,sosmed,jobs }=req.body
    if(!contact || !sosmed || !jobs){
     return res.status(300).send('not found request body')
    }
      const token = req.cookies.token; 
    const user = jwt.verify(token, process.env.jwt_secret_key_values); 
    const sanitizeContact= sanitizeDataInput(contact)
    const sanitizeSosmed= sanitizeDataInput(sosmed)
    const sanitizeJobs= sanitizeDataInput(jobs)
   const response= await detailProfileUser.findOne({usersRelations:user.id})
    if(!response){
      return res.status(401).send("invalid")
    }
    response.contact=sanitizeContact
    response.sosialmedia=sanitizeSosmed
    response.jobs=sanitizeJobs
    await response.save()
    return res.status(200).send('sukses update')
  }
  catch(err){
    return res.status(400).json({message:err.message})
  }
}


// profile by id user
const getProfileByIdUser=async(req,res)=>{
  try{
    const {id}= req.params
    const findProfileByIdUser= await detailProfileUser.findOne({usersRelations:id}).populate('usersRelations')
    res.status(200).send(findProfileByIdUser)
    console.log(findProfileByIdUser)
  }
  catch(err){
    return res.status(404).send({massage:err})
  }
}

const editProfileByIdUser=async(req,res)=>{
  try{
    const {id}=req.params 
    const {contact,sosialmedia,jobs,username,email} = req.body 
    if(!contact || !sosialmedia || !jobs || !username || !email){
      res.status(401).send('not found input!!')
    }
    else{

      // upload img profile to cloudinary 
                const result = await cloudinary.uploader.upload(req.file.path, {
             resource_type: "image",
            folder: "courses/img",
          });
      
          fs.unlinkSync(req.file.path);

      // update username and email by user id 
      await User.findByIdAndUpdate(id,{
        username:sanitizeDataInput(username),
        email:validateEmail(email),
        imgProfile:result.secure_url,
        idpublickImgProfile:result.public_id
      },{new:true, useFindAndModify:false})



      // update profile by relasi user id 
      const getProfileAndEdit= await detailProfileUser.findOne({usersRelations:id})
      if(!getProfileAndEdit){
        res.status(300).send('not found id user in detail profile')
      }
      getProfileAndEdit.contact=sanitizeDataInput(contact)
      getProfileAndEdit.sosialmedia=sosialmedia
      getProfileAndEdit.jobs=sanitizeDataInput(jobs)
      await getProfileAndEdit.save()
      res.status(200).send('sukses edit profile')
    }
  }
  catch(err){
    return res.status(404).send({massage:err})
  }
}
module.exports = { getUsers, createUser,loginUser, editProfileUser,refreshToken, getProfileByIdUser, editProfileByIdUser, logout};
