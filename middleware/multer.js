 var multer=require("multer")
 const fs = require('fs');
module.exports={
    upload:multer({ storage: multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"images/")
        },
        filename:function(req,file,cb){
            const MIME_TYPES = {
                'image/jpg': '.jpg',
                'image/jpeg': '.jpg',
                'image/png': '.png'
              };
              var filen;
              const extension = MIME_TYPES[file.mimetype];

              if(req.id==null){
                var id=Math.random().toString(36).substring(2, 8);
                filen=id+extension;
                req.id=id;
              }
              else {
                if(fs.existsSync("./images/"+req.id+".png")){
                    fs.unlink('./images/'+req.id+".png", (err) => {
                        if (err) throw err;
                      })
                }else if(fs.existsSync("./images/"+req.id+".jpg")){
                    fs.unlink('./images/'+req.id+".jpg", (err) => {
                        if (err) throw err;
                      })
                }
                filen=req.id+extension
              }
              
            cb(null,filen)
        }
    })}),
    
}