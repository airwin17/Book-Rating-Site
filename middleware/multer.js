 var multer=require("multer")
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
              const extension = MIME_TYPES[file.mimetype];
              var filen=JSON.parse(req.body.book).title+extension
            cb(null,filen)
        }
    })}),
    
}