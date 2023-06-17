require("dotenv").config();
const privateKey=process.env.PRIVATEKEY;
const jwt = require('jsonwebtoken');
var muser=require("../Model/user")

module.exports={
    authentificationCheck:async function(req,res,next){
        try{
            const ptoken=req.headers.authorization.split(' ')[1];
            var decodedtoken=await jwt.verify(ptoken,privateKey);
            var user=await muser.findOne({_id:decodedtoken._id});
            if(user!=null){
                res.locals._id=decodedtoken._id
                next()
            }else{
                res.status(401)
                res.send("login please")
            }
        }catch(err){
            res.status(401)
            res.send(err)
        }
    }
}