var express = require('express');
var router = express.Router();
var User=require('../model/user');
var isemail=require('isemail');
var multer=require('multer');
var upload=multer({dest:'public/images/uploads'});
var passwordValidator=require('password-validator');
var schema=new passwordValidator();
/* GET users listing. */
schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.is().not().oneOf(['passw0rd','Password123']);
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userupdate/:id',function(req,res){
  User.findById(req.params.id,function(err,rtn){
      if(err) throw err;
      res.render('users/user_update',{user:rtn});

  });

});
router.post('/userupdate',upload.single('photo'),function(req,res){
  var update={
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  if(req.file) update.imageUrl = '/images/uploads/' + req.file.filename;

  User.findByIdAndUpdate(req.body.id,{$set: update},function(err,rtn){
    if(err) throw err;
    res.redirect('/users/userdetail/'+req.body.id);
  })
})


router.get('/useradd',function(req,res){
  res.render('users/user_add');
});



router.get('/userlist',function(req,res){
User.find(function(err,rtn){
  if(err) throw err;
  res.render('users/user_list',{users:rtn});
})

})


router.get('/userdetail/:id',function(req,res){
  console.log(req.params.id);
    User.findById(req.params.id,function(err,rtn){
      if(err) throw err;
      res.render('users/user_detail',{user:rtn});
  });
});

router.get('/userdelete/:id',function(req,res){
  User.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err) throw err;
    res.redirect('/users/userlist');
  });
});

router.post('/useradd',upload.single('photo'),function(req,res){
  var user=new User();
  user.name=req.body.name;
  user.email=req.body.email;
  user.password=req.body.password;
  if(req.file)user.imageUrl='/images/uploads/'+req.file.filename;
  user.save(function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.redirect('/users/userlist');
  });
});

router.post('/duemail',function(req,res){
  console.log(req.body.email);
  User.findOne({email:req.body.email},function(err,rtn){
    if(err) throw err;
    if(req.body.email != ''){
    if(rtn!=null || !isemail.validate(req.body.email)){
      res.json({status:true})
    }
    else{
      res.json({status:false})
    }
  }
  })
})

router.post('/checkp',function(req,res){
  var sta=schema.validate(req.body.password);
  res.json({status:sta});
})


module.exports = router;
