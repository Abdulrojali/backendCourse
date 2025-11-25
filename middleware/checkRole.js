// middleware/role.js
function roleMiddleware(...args) {
  return (req, res, next) => {
    if(args.includes(req.user.roles)){
    
    next()
    }

    else{
        const status='invalid'
       req.status=status
       return res.status(403).json({ msg: "Akses ditolak" });  
    }
  };
}

module.exports=roleMiddleware