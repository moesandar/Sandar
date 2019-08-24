var express=require('express');
var router=express.Router();
var Post=require('../../model/Post');
var Auth=require('../middeleware/check-auth');

router.get('/list',Auth,function(req,res){
  Post.find({}).populate('author').exec(function(err,rtn){
    if(err){
      res.status(500).json({
        message:'server err',
        error:'err'
      })
    }
    if(rtn.length<1){
      res.status(204).json({
        message:'content not found'
      })
    }
    else{
      res.status(200).json({
        posts:rtn

      })
    }
  })
})


router.get('/detail/:id',Auth,function(req,res){
  Post.findById(req.params.id).populate('author').exec(function(err,rtn){
    if(err){
      res.status(500).json({
        message:'sever err',
        error:'err'
      })
    }
    if(rtn==null){
      res.status(204).json({
        message:'content not found'
      })
    }else{
      res.status(200).json({
        post:rtn
      })
    }
  })
})

router.delete('/:id',Auth,function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'sever error',
        error:err
      })
    }else{
      res.status(200).json({
        message:'delete ok'
      })
    }
  })
})

router.post('/add',function(req,res){
  var post=new Post();
  post.title=req.body.title;
  post.content=req.body.content;
  post.author=req.body.athor
  post.save(function(err2,rtn2){
      if(err2){
        res.status(500).json({
          message:'server error',
          error:err2
        })
      }
      else{
        res.status(201).json({
          message:'created'
        })
      }


})
})




router.patch('/:id',Auth,function(req,res){
  var updateOps={}

  for(var ops of req.body){
    updateOps[ops.proName]=(ops.proName!='password')? ops.value:bcrypt.hashSync(ops.value,bcrypt.genSaltSync(8),null);

  }
  Post.findByIdAndUpdate(req.params.id,{$set:updateOps},function(err,rtn){
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
