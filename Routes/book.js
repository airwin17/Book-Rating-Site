const express=require("express")
const bookc=require("../Controllers/bookController");
const multer=require("../middleware/multer");
const auth=require("../middleware/authentification")
let router=express.Router();
router.use(express.json())
router
    .route("/")
    .get(bookc.getAllBooks)
router
    .route("/:id")
    .get(bookc.getBookById)
router
    .route("/")
    .post(auth.authentificationCheck,multer.upload.single("image"),bookc.addBook)
router
    .route("/:id")
    .put(auth.authentificationCheck,bookc.checkContentType,multer.upload.single("image"),bookc.updateBook)
router
    .route("/:id/rating")
    .post(auth.authentificationCheck,bookc.addRating)
router
    .route("/:id")
    .delete(auth.authentificationCheck,bookc.deleteBook)
module.exports=router