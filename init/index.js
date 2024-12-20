const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connection establish to DB")
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb+srv://aniketchauhan89230:LSWmcRhoxpiF82js@cluster0.5tpdw.mongodb.net/test")
}

const initDB=async()=>{
    // await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:"66e07a4821ba42ceb84ccf63"
    }))
    await Listing.insertMany(initData.data);
    console.log("data is initalized");
}

initDB();