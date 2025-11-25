const {sanitizeDataInput,validateEmail}=require('../utilis/sanitize.js')

const inputLogin= (req,res,next)=>{
    try{
        const {username,password}=req.body
        req.body.username = sanitizeDataInput(username),
        req.body.password=password

        next()
    }
    catch(err){
        res.status(400).send({massage:err.massage})
    }
}
const inputRegisters=(req,res,next)=>{
    try{
        const {nama,username,password,email}=req.body 
        req.body.nama=sanitizeDataInput(nama)
        req.body.username=sanitizeDataInput(username)
        req.body.password=password.trim()
        req.body.email=validateEmail(email)

        next()
    }
    catch(err){
        res.status(400).send({message:err.message})
    }
}
module.exports={inputLogin,inputRegisters}