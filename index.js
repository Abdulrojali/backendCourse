const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");
const cors =require('cors')
// router 
const useRouterAccounts = require("./router/userRouter");
const courseRouter=require('./router/courseRouter.js');
const adminRouter =require('./router/adminRouter.js');
const videoRouter =require('./router/videoRouter.js')
const historyRouter =require('./router/historyRouter.js')

require('dotenv').config()
const app = express();
const PORT = process.env.port_Endpoint;


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.use(cookieParser());

connectDB();
app.use(cors({
  origin: ["http://localhost:5174","http://localhost:5173"],
  credentials: true, 
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// app.options(/.*/, cors());
app.options(/^\/api\/.*$/, cors());

app.use("/user", useRouterAccounts);
app.use('/admin',adminRouter)

app.use('/course',courseRouter) 
app.use('/video',videoRouter)
app.use('/history',historyRouter)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
