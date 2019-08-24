var express=require('express');
var router=express.Router();
var User=require('../../model/user');
var multer=require('multer');
var upload=multer({dest:'public/images/uploads'});
var bcrypt=require('bcrypt');
var Auth=require('../middeleware/check-auth');
router.get('/',function(req,res){
  res.status(201).json({
    message:'home'
  })
})

router.get('/list',Auth,function(req,res){
  User.find({},function(err,rtn){
    if(err){
      res.status(500).json({
        message:'sever err',
        error:'err'
      })
    }
    if(rtn.length<1){
      res.status(204).json({
        message:'no data found'
      })
    }else{
      res.status(200).json({
        users:rtn
      })
    }
  })
})

router.get('/detail/:id',Auth,function(req,res){
  User.findById(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'sever err',
        error:'err'
      })
    }else{
    if(rtn==null){
      res.status(204).json({
        message:'not found'
      })
    }else{
      res.status(200).json({
        user:rtn
      })
    }
  }
  })
})
router.delete('/:id',function(req,res){
  User.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'server ok',
        error:'err'
      })
    }
    else{
      res.status(200).json({
        message:'delete ok'
      })
    }
  })
})

router.post('/add',Auth,upload.single('photo'),function(req,res){
  var user=new User();
  user.name=req.body.name;
  user.email=req.body.email;
  user.password=req.body.password
  if(req.file) user.imageUrl='/images/uploads/' + req.file.filename;

   User.findOne({email:req.body.email},function(err2,rtn2){
     if(err2){
       res.status(500).json({
         message:'server error',
         error:err2
       })
     }
     else{
       if(rtn2==null){
       user.save(function(err,rtn){
         if(err){
           res.status(500).json({
             message:'server error',
             error:err2
           })
         }else{
           res.status(201).json({
             message:'account created'
           })
         }
       })
}

     else{
       res.status(409).json({
         message:'email is already exist'
       })
     }
   }
   })
})
router.patch('/:id',Auth,function(req,res){
  var updateOps={}

  for(var ops of req.body){
    updateOps[ops.proName]=(ops.proName!='password')? ops.value:bcrypt.hashSync(ops.value,bcrypt.genSaltSync(8),null);

  }
  User.findByIdAndUpdate(req.params.id,{$set:updateOps},function(err,rtn){
    if(err){
      res.status(500).json({
        message:'server error',
        error:err
      })
    }else{
      res.status(200).json({
        message:'user account created'
      })
    }
  })
})
module.exports=router;
