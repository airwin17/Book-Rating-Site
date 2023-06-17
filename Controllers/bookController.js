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
        res.status(200)
        res.json(books)
    },
    getBookById:async function(req,res){
        var book=await bookSchema.findOne({_id:req.params.id})
        res.json(book)
    },
    getBestRatingBooks:async function(req,res){
        var books=await bookSchema.find({}).sort({averageRating:-1})
        res.json([books[0],books[1],books[2]]);
    },
    addBook:async function(req,res){
        try{
            const MIME_TYPES = {
                'image/jpg': '.jpg',
                'image/jpeg': '.jpg',
                'image/png': '.png'
              };
              const extension = MIME_TYPES[req.file.mimetype];
            var filen=JSON.parse(req.body.book).title+extension
            var book=new bookSchema(JSON.parse(req.body.book))
            book.imageUrl=filen;
            book.averageRating=0
            console.log(filen)
            //console.log(book)
            if(Number.isInteger(book.year)){
                book.save()
                res.json({message:"envoié avec succes"})
            }else{
                res.status(401)
                res.send("wrong year forma")
            }
            
        }catch(err){
            res.send(err)
        }
    },
    updateBook:async function(req,res){
        try{
            var reqBook=JSON.parse(req.body.book)
            
            reqBook.imageUrl=multer.filename;
            if(res.locals._id==reqBook._id){
                var oldimage=await bookSchema.findById(reqBook._id).imageUrl
            fs.unlink('../images'+oldimage, (err) => {
                if (err) throw err;
              });
                await bookSchema.findByIdAndUpdate(reqBook._id,reqBook)
                res.send("updated")
            }
            
        }catch(err){
            res.status(403)
            res.send(err)
        }
    },
    deleteBook:async function(req,res){
        
        var targetbook=await bookSchema.findOne({_id:req.body._id})
        if(targetbook.userId==res.locals.arg){
            await bookSchema.deleteOne({_id:req.body._id})
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
                await bookSchema.findByIdAndUpdate(res.locals._id,targetbook)
            }else{
                res.status(403)
            }
        }else{
            res.status(403)
            res.json({message:"unauthrized action rating should be from min 0 to max 5"})
        }
    },
    checkContentType:function(req,res){
        if(req.is("json")){
            return async function(req,res){
                try{
                    if(res.locals._id==req.body._id){
                        var abook=await bookSchema.find(req.body._id)
                        req.body.imageUrl=abook.imageUrl
                        await bookSchema.findByIdAndUpdate(req.body._id,req.body)
                        res.send("updated")
                    }else{
                        res.status(403)
                        res.send("unauthotized action")
                    }
                    
                }catch(err){
                    res.status(403)
                    res.send(err)
                }

            }
        }else{
            return function(req,res,next){
                next()
            }
        }
    }
    
}