
var mongoose = require ('mongoose');
var bookSchema=require("../Model/book")
var multer=require("../middleware/multer")
const fs = require('fs');
var serverUrl=process.env.serverUrl
module.exports={
    getAllBooks:async function(req,res){
        var books=await bookSchema.find({})
        for(var i=0;i<books.length;i++){
            books[i].imageUrl=serverUrl+"images/"+books[i].imageUrl
        }
        res.json(books)
    },
    getBookById:async function(req,res){
       if(req.params.id=="bestrating"){
        console.log("lol")
        var books=await bookSchema.find({}).sort({averageRating:-1})
        console.log(books)
        var p=[];
        for(var i=0;i<books.length;i++){
            books[i].imageUrl=serverUrl+"images/"+books[i].imageUrl
            p.push(books[i]);
        }
        res.json(p);
       }else{
        try{
            var book=await bookSchema.findOne({_id:req.params.id});
            book.imageUrl=serverUrl+"images/"+book.imageUrl;
            res.json(book)
        }catch(err){
            res.send(err)
        }
       }
    },
    
    addBook:async function(req,res){
        try{
            const MIME_TYPES = {
                'image/jpg': '.jpg',
                'image/jpeg': '.jpg',
                'image/png': '.png'
              };
              const extension = MIME_TYPES[req.file.mimetype];
            var book=new bookSchema(JSON.parse(req.body.book));
            book._id=req.id;
            var filen=book._id+extension
            
            book.imageUrl=filen;
            book.averageRating=0
            
            if(Number.isInteger(book.year)){
                book.save()
                res.json({message:"envoié avec succes"})
            }else{
                res.status(401)
                res.send("wrong year format")
            }
            
        }catch(err){
            res.send(err)
        }
    },
    updateBook:async function(req,res){
        try{
            var connectedUserId=res.locals._id;
            var reqBook=JSON.parse(req.body.book)
            var targetbook=await bookSchema.findOne({_id:req.params.id})
            reqBook.imageUrl=multer.filename;
            if(connectedUserId==targetbook.userId){
              const MIME_TYPES = {
                'image/jpg': '.jpg',
                'image/jpeg': '.jpg',
                'image/png': '.png'
              };
              const extension = MIME_TYPES[req.file.mimetype];
                reqBook.imageUrl=targetbook._id+extension
                await bookSchema.findByIdAndUpdate(req.params.id,reqBook)
                res.send("updated")
            }
            
        }catch(err){
            res.status(403)
            res.send(err)
        }
    },
    deleteBook:async function(req,res){
        
        var targetbook=await bookSchema.findOne({_id:req.params.id})
        console.log(res.locals._id+" "+targetbook.userId)
        if(targetbook.userId==res.locals._id){
            await bookSchema.deleteOne({_id:req.params.id});
            fs.unlink('./images/'+targetbook.imageUrl, (err) => {
                if (err) throw err;
              })
            res.status(200)
            res.json({message:"book deleted"})
        }else{
            res.status(403)
            res.json({message:"unauthrized action"})
        }
    },
    addRating:async function(req,res){
        
        if(req.body.rating>=0&&req.body.rating<=5){
            if(req.body.userId==res.locals._id){
                var targetbook=await bookSchema.findOne({_id:req.params.id})
                var somme=0;
                for(var i=0;i<targetbook.ratings.length;i++){
                    if(targetbook.ratings[i].userId==req.body.userId){
                        targetbook.ratings[i].grade=req.body.rating;
                    }else if(i==targetbook.ratings.length-1){
                        targetbook.ratings.push(req.body)
                    }
                    somme+=targetbook.ratings[i].grade
                }
                targetbook.averageRating=(somme/targetbook.ratings.length);
                await bookSchema.findByIdAndUpdate(targetbook._id,targetbook)
            }else{
                res.status(403)
            }
        }else{
            res.status(403)
            res.json({message:"unauthrized action rating should be from min 0 to max 5"})
        }
    },
    checkContentType:async function(req,res,next){
        if(req.is("json")){
            
            try{
                var abook=await bookSchema.findOne({_id:req.params.id})
                console.log(abook.userId);
                if(res.locals._id==abook.userId){
                    req.body.imageUrl=abook.imageUrl
                    await bookSchema.findByIdAndUpdate(req.params.id,req.body)
                    res.send("updated")
                }else{
                    res.status(403)
                    res.send("unauthotized action")
                }
            }catch(err){
                res.status(403)
                res.send(err)
            }

        }else{
            req.id=req.params.id;
            next()
        }
    }
}