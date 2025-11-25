const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
 const authHeader = req.headers["authorization"];
const accessToken = authHeader?.split(" ")[1];
const decoded = jwt.verify(accessToken, process.env.access_key);
req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports ={authMiddleware};
