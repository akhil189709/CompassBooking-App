const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router({mergeParams:true});
const expressError=require("../utils/expressError.js")
const Listing=require("../models/listing");
const Review=require("../models/review")
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");


// Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;