const express = require("express");
const courseRouter = express.Router();
const courseControllers=require('../controllers/courseControllers')
const historyControllers=require('../controllers/historyControllers')
const multer = require('multer')
const {authMiddleware} =require('../middleware/auth')
const roleMiddleware =require('../middleware/checkRole')
const upload = multer({ dest: "uploads/" });


// saat menjalankan endpoint ini tolong set header bearer nya di client side
courseRouter.get('/',courseControllers.getCourse) // sukses testing
courseRouter.get('/getCourse/:id',authMiddleware,roleMiddleware('admin','user'),courseControllers.getCourseById) // sukses testing
courseRouter.get('/join/:id',authMiddleware,roleMiddleware('user'),courseControllers.getVideoByUserJoinCourse)
courseRouter.get('/populer',authMiddleware,roleMiddleware('user'),courseControllers.getPopularCourse)
courseRouter.get('/dailyActivity',authMiddleware,roleMiddleware('user'),courseControllers.getDailyActivityNow)

// admin router handler in course
courseRouter.get('/admin',authMiddleware,roleMiddleware('admin'),courseControllers.getCourseByAdmin) // sukses testing 
courseRouter.post('/createCourse',authMiddleware,roleMiddleware('admin'),upload.single('image'),courseControllers.createCourse) // sukses testing
courseRouter.post('/update/:id',authMiddleware,roleMiddleware('admin'),upload.single('image'),courseControllers.editCourse)// sukses testing
courseRouter.delete('/delete/:id',authMiddleware,roleMiddleware('admin'),courseControllers.deleteCourseById)// sukses testing


// user router handler in course
courseRouter.post('/join/:id',authMiddleware,roleMiddleware('user'),courseControllers.userJoinCourse)

module.exports=courseRouter