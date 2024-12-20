
const Listing=require("./models/listing");
const Review=require("./models/review.js")
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"...",req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be login")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to edit")
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let listing=await Review.findById(reviewId);
    if(!listing.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this")
        return res.redirect(`/listing/${id}`);
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");

        throw new expressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,result)
    }else{
        next();
    }
}