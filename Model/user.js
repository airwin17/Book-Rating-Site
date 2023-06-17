var mongoose=require("mongoose");
const { Schema } = mongoose;
const userschema=new Schema(
    {
        email:String,
        password:String,
    },
    { collection: 'user' }

)
module.exports=mongoose.model("user",userschema)