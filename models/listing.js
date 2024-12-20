const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js")
const User=require("./user.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,  
    },
    price:Number,
    location:String,
    country:String,
    categories:{
        type:String,
        enum:['Mountains','Pools','City','Castles','Camping','Farms','Arctic','Boats','Rooms','Domes'],
        default:'City'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id :{$in: listing.reviews}})
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;