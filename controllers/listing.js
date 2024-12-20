const Listing = require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/listing.ejs",{allListing})
}

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    res.render("listing/new.ejs");
}

module.exports.ShowListing=async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist")
        res.redirect("/listing");
    }
    console.log(listing)
    res.render("listing/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let categories=req.body.categories;
    console.log(url,filename,categories)
    let listing=req.body.listing;
    const newListing= new Listing(listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.categories=categories;
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listing")
    
}
module.exports.renderEditListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist")
        res.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listing/edit.ejs",{listing,originalImageUrl})
}

module.exports.updateEditListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing is updated")

    res.redirect(`/listing/${id}`);
}


module.exports.deleteListing= async(req,res)=>{
    let {id}=req.params;
    let deletedlist= await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success","Listing is Deleted")
    res.redirect("/listing")
}

module.exports.filter=async(req,res)=>{
    const filterOption=req.query.option;
    let filteredlisting=await Listing.find({categories:filterOption});
    res.render("listing/filter.ejs",{filteredlisting});
}

module.exports.search=async(req,res)=>{

    let searchItem=req.query.input?req.query.input.toString():'';
    searchItem = searchItem.replace(/\$/g, '');
    let searchlisting=[];
    if(searchItem){
    searchlisting=await Listing.find({
        $or:[
        {name:{$regex:searchItem,$options:'i'}},
        {country:{$regex:searchItem,$options:'i'}},
        {location:{$regex:searchItem,$options:'i'}},
        {categories:{$regex:searchItem ,$options:'i'}}
    ]});
    }else{
    searchlisting=await Listing.find();
    res.render("listing/listing.ejs",{allListing:searchlisting});

    }
    res.render("listing/filter.ejs",{filteredlisting:searchlisting});
}