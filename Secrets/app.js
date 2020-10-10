//jshint esversion:6
require('dotenv').config()
const express=require("express");
const ejs=require("ejs");
const bodypar=require("body-parser");
const mongoose=require("mongoose");
const passport=require("passport");
const session=require("express-session");
const pass=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const app=express();

app.use(session({
  secret: 'littlesecret',
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());



//Already used modules for reference

//const md5=require("md5");
//const bcrypt=require("bcrypt");
//const saltRounds = 10;
//const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

mongoose.set('useCreateIndex','true');

const userschema=new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  secret:String

});
userschema.plugin(pass);
userschema.plugin(findOrCreate);

//userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userschema);

passport.use(User.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(express.static("public"));
app.use(bodypar.urlencoded({extended:true}));
app.set('view engine','ejs');

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/Secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/",function(req,res){
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

  app.get("/auth/google/Secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect("/secrets");
    });

app.get("/login",function(req,res){
  res.render("login");
});


app.post("/login",function(req,res){


  const user=new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){//predefined function for checking logins

    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
    });
  }

  });
  /*const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,founduser){

    if(err)
    {
      console.log(err);
    }
    else{
      if(founduser){
        bcrypt.compare(password, founduser.password, function(err, result) {
          if(result===true)
          {
            res.render("secrets");
          }
});


      }
    }
  });*/
});

app.get("/register",function(req,res){
  res.render("register");

});

app.get("/secrets",function(req,res){
  User.find({"secret":{$ne:null}},function(err,foundUsers){
    if(err){
      console.log(err);
    }else
    {
      if(foundUsers){
        res.render("secrets",{usesecret:foundUsers});
      }
    }
  });



});

app.get("/submit",function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }

});

app.post("/submit",function(req,res){
  const con=req.body.secret;
  //console.log(con);
  //console.log(req.user.id);
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }else{

      if(foundUser){
        foundUser.secret=con;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });

});


app.post("/register",function(req,res){

  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });

  /*bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const use=new User({
      email:req.body.username,
      password:hash
    });

    use.save(function(err){
      if(err)
      {
        console.log(err);
      }
      else{
        res.render("secrets");
      }
    });
});*/

});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});






























app.listen(3000,function(){
  console.log("Server running on port 3000");
});
