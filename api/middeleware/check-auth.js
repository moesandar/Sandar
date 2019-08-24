const jwt=require("jsonwebtoken");
 module.exports=function(req,res,next){

   try{
     const token=req.headers.token;
     console.log(token);
     const decoded=jwt.verify(token ,"nodejs005");
     console.log(decoded);
     next();
   }catch(error){
     return res.status(401).json({
       message:'fail'
     })
   }
 }
