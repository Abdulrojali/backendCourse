const express = require("express");
const historyRouter = express.Router();
const historyControllers=require('../controllers/historyControllers')

const {authMiddleware} =require('../middleware/auth')
const roleMiddleware =require('../middleware/checkRole')


// // history crud course by admin
historyRouter.get('/latest',authMiddleware,roleMiddleware('admin'),historyControllers.getLatestHistory) 
historyRouter.get('/byAdmin/:id',authMiddleware,roleMiddleware('admin'),historyControllers.getHistoryByAdmin)
// 

// // history watch video by id video
historyRouter.get('/Watch/video/user',authMiddleware,roleMiddleware('user'),historyControllers.getHistoryWatchVideoByIdUserAndCourse)

module.exports=historyRouter