const bcrypt= require('bcrypt')
// middleware registers
async function hassing(req,res,next){
    try{
        const {nama,username,password,email}=req.body
         const saltRounds = 10; 
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         req.body.nama=nama
         req.body.password=hashedPassword
         req.body.username=username
         req.body.email=email
         next()
    }
    catch(err){
        console.log(err)
        res.status(400).json({massage:err.message})
      
    }

}

module.exports=hassing