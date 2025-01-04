const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const review = require("./reviews");


const postSchema =new schema({
    title: {type: String,required: true},
    description: {type: String,required: true},
    owner: {
        type: schema.Types.ObjectId,
        ref:"User"
    },
    file:{
        url: String,
        filename:String,
        },
});

// listSchema.post("findOneAndDelete",async (listing)=>{
//     if(listing){
//         await review.deleteMany({_id :{$in: listing.reviews}})
//     }
// });


const Post = mongoose.model("Post",postSchema);
module.exports = Post;