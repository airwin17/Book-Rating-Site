require("dotenv").config();
const privateKey=process.env.PRIVATEKEY;
const bcrypt = require('bcrypt');
var muser=require("../Model/user")
const jwt = require('jsonwebtoken');
const saltRounds = 10;
module.exports={
    addNewUser:async function (req,res){
        if(req.body.password.length>5){
            if(await muser.findOne({email:req.body.email})==null){
                let newuser={
                    email:req.body.email,
                    password:await bcrypt.hash(req.body.password, saltRounds)
                }
                let user=new muser(newuser)
                user.save()
                res.status(200)
                res.json({
                    Message:"user singed up successfully"
                })
            }else{
                res.json({
                    Message:"email already used"
                })
            }
        }else{
            res.status(422);
            res.send("at least 6 length password required")
        }
    },
    loginUser:async function(req,res){
        var user=await muser.findOne({email:req.body.email})
        if(user!=null){
            if(await bcrypt.compare(req.body.password, user.password)){
                const tok=jwt.sign({_id:user._id},privateKey)
                res.status(200)
                res.json({
                userId:user._id,
                token:tok
            })
            }
        }else{
            res.status(401)
            res.json({message:"failed to connect check email or password"})
        }
    }
}