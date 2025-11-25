const jwt =require("jsonwebtoken");

// Buat Access Token
 const generateAccessToken = (user) => {
  return jwt.sign(
    {name:user.name, id: user.id, roles: user.roles },
    process.env.access_key,
    { expiresIn: "15m" } // access token berlaku 15 menit
  );
};

// Buat Refresh Token
 const generateRefreshToken = (user) => {
  return jwt.sign(
    {name:user.name, id: user.id, roles: user.roles },
    process.env.refresh_key,
    { expiresIn: "7d" } // refresh token berlaku 7 hari
  );
};


module.exports={generateAccessToken,generateRefreshToken}