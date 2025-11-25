const express = require("express");
const videoRouter = express.Router();

const videoControllers=require('../controllers/videoControllers')
const multer = require('multer')
const {authMiddleware} =require('../middleware/auth')
const roleMiddleware =require('../middleware/checkRole')
const upload = multer({ dest: "uploads/" });

// new video by id course
videoRouter.post('/new/:id',authMiddleware,roleMiddleware('admin'),upload.single('video'),videoControllers.addVideo)// sukses testing

// get all video
videoRouter.get('/',authMiddleware,roleMiddleware('admin','user'),videoControllers.getVideo) // sukses testing 

// get video by id course
videoRouter.get('/:id',authMiddleware,roleMiddleware('admin','user'),videoControllers.getVideoByIdCourse) // sukses testing 

// update video by id 
videoRouter.post('/update/:id',authMiddleware,roleMiddleware('admin'),upload.single('video'),videoControllers.updateVideoCourse)// sukses

// delete video by id 
videoRouter.delete('/delete/:id',authMiddleware,roleMiddleware('admin'),videoControllers.deleteVideo) // sukses

videoRouter.post('/update/status/:id',authMiddleware,roleMiddleware('user'),videoControllers.updateStatusVideo)

module.exports= videoRouter