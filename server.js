
var mongoose=require("mongoose");
const express = require('express');
const app = express();
var cors = require('cors');
var auth=require("./Routes/auth")
var book=require("./Routes/book")
var swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'Swagger.yml'));
require("dotenv").config();

app.use(cors());
app.use("/api/auth",auth)
app.use("/api/books",book)
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())

const url = "mongodb://localhost:27017/bookNotation";

mongoose.connect(url, { useNewUrlParser: true });

app
  .get("/images/:imgName",function(req,res){
    var image=req.params.imgName
    res.sendFile("./images/"+image,{
      root:__dirname
    })
})

app.listen(4000,console.log('Example app is listening on port 4000.'));