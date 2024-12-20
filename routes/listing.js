const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")

const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner,validateListing, isAuthor}=require("../middleware.js")
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});



router.route("/")
    .get(wrapAsync(listingController.index))// Index Route
    .post(isLoggedIn,upload.single("listing[image]"),validateListing ,wrapAsync(listingController.createListing))//create Route
// filter
router.get("/filter",listingController.filter);
router.get("/search",listingController.search);

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.ShowListing))//Show Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateEditListing))// Update Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))//delete Route

//Edit Route
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditListing))

module.exports=router;