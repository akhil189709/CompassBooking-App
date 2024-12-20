if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}


const express=require("express")
const app=express();
const mongoose=require("mongoose")
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const expressError=require("./utils/expressError.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const userRoute=require("./routes/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")))

const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connection establish")
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
},
touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STROE",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,   
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listing",listing);
app.use("/listing/:id/reviews",review);
app.use("/",userRoute)


app.get("/",(req,res)=>{
    res.redirect("/listing")
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("listing/error.ejs",{message});
})

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found"));
})

app.listen(8080,()=>{
    console.log("server listen on port")
})
