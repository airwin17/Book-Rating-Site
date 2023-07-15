const mongoose=require("mongoose");
const { Schema } = mongoose;
let bookschema=new Schema(
     {
        _id: String,
        userId : String,
        title : String,
        author : String ,
        imageUrl : String,
        year: Number,
        genre: String,
        ratings : [
        {
        userId : String,
        grade : Number,
        }
        ] ,
        averageRating : Number
    },
    {
        collection:"book"
    }
)
module.exports=mongoose.model("book",bookschema)