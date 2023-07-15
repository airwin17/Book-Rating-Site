
var mongoose=require("mongoose")
const express = require('express');
const app = express();
var cors = require('cors');
var auth=require("./Routes/auth")
var book=require("./Routes/book")
require("dotenv").config();

app.use(cors());
app.use("/api/auth",auth)
app.use("/api/books",book)
app.use(express.json())

const url = process.env.ATLASURL;
console.log(url)
mongoose.connect(url, { useNewUrlParser: true });

app
  .get("/images/:imgName",function(req,res){
    var image=req.params.imgName
    res.sendFile("./images/"+image,{
      root:__dirname
    })
})

app.listen(4000,console.log('Example app is listening on port 4000.'));