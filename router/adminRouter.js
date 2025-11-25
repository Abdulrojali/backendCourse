const express = require("express");
const adminRouter = express.Router();
const adminControllers=require('../controllers/adminControllers')
const {authMiddleware} = require('../middleware/auth')

const hassing=require('../middleware/hash')
const checkRole =require('../middleware/checkRole')
const sanitize= require('../middleware/sanitize')

const multer = require('multer')
const upload = multer({ dest: "uploads/" });

// saat menjalankan endpoint ini tolong set header bearer nya di client side
adminRouter.get('/',adminControllers.getDataAdmin)

adminRouter.get('/profile/:id',authMiddleware,checkRole('admin'),adminControllers.profileAdmin)
adminRouter.post('/refreshToken',adminControllers.refreshToken)
adminRouter.post('/register',sanitize.inputRegisters,hassing,adminControllers.createAdmin)
adminRouter.post('/login',sanitize.inputLogin,adminControllers.loginAdmin)
adminRouter.post('/editProfile/:id',authMiddleware,upload.single('profile'),adminControllers.editProfileAdmin)
adminRouter.put('/update/:id',authMiddleware,checkRole(['admin']),adminControllers.updateDataAdmin)
adminRouter.delete('/delete/:id',authMiddleware,checkRole(['admin']),adminControllers.deleteDataAdmin)

module.exports=adminRouter