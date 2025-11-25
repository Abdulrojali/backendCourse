const express = require("express");
const useRouterAccounts = express.Router();
const  userController  = require("../controllers/userController");
const {authMiddleware} = require('../middleware/auth')


const hassing=require('../middleware/hash')
const checkRole =require('../middleware/checkRole')
const sanitize= require('../middleware/sanitize')


const multer = require('multer')
const upload = multer({ dest: "uploads/" });


// GET /api/users
useRouterAccounts.get("/",userController.getUsers);
useRouterAccounts.get('/profile/:id',authMiddleware,checkRole('user'),userController.getProfileByIdUser)
// POST /api/users
useRouterAccounts.post('/profile/edit/:id',authMiddleware,checkRole('user'),upload.single('profileImg'),userController.editProfileByIdUser)
useRouterAccounts.post('/refreshToken',userController.refreshToken)
useRouterAccounts.post("/registers",sanitize.inputRegisters,hassing,userController.createUser);
useRouterAccounts.post("/login",sanitize.inputLogin,userController.loginUser);
useRouterAccounts.post('/logout',userController.logout)
// useRouterAccounts.post('/editProfile',authMiddleware,checkRole('user'),userController.editProfileUser)

module.exports = useRouterAccounts;
