var express=require('express');
var router=express.Router();
var Admin=require('../../model/Admin');
var  jwt=require('jsonwebtoken');
var Auth=require('../middeleware/check-auth');
router.post('/signup',function(req,res){
  console.log('call');
  var admin=new Admin();
  admin.name=req.body.name;
  admin.email=req.body.email;
  admin.password=req.body.password;
  Admin.findOne({email:req.body.email},function(err2,rtn2){
    if(err2){
      res.status(500).json({
        message:'server error',
        error:err
      })
    }
    else{
      if(rtn2==null){
        admin.save(function(err,rtn){
          if(err){
            res.status(500).json({
              message:'server error',
              error:err
            })
          }else{
            res.status(200).json({
              message:'admin account created'
            })
          }
        })
      }else{
        res.status(409).json({
          message:'email is already exit'
        })
      }
    }
  })
})

router.post('/signin',function(req,res){
  Admin.findOne({email:req.body.email},function(err,rtn){
    if(err){
      res.status(500).json({
        message:'server error',
        error:err
      })
    }
    else{
      if(rtn !=null && Admin.compare(req.body.password,rtn.password)){
        const token=jwt.sign(
          {
          email:rtn.email,
          adminId:rtn._id
        },
"nodejs005",
{
  expiresIn:'2h'
}
);
        res.status(200).json({
          message:'it is ok',
          data:rtn,
          token:token
        })
      }else{
        res.status(404).json({
          message:'no content found'
        })
    }
     }
  })
 })
module.exports=router;
