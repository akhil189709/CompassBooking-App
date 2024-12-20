const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("Users/signup.ejs")
    }

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){return next(err);}
        req.flash("success","Welcome to Wonderlust!")
        res.redirect("/listing")
    })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("Users/login.ejs")
}
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome to Winderklust! , you are login")
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next();
        }else{
            req.flash("success","you are logout!")
            res.redirect("/listing")
        }
    })
}
