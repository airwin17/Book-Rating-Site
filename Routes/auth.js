const express=require("express")
const userc=require("../Controllers/userController")
let router=express.Router();
router.use(express.json())
router
    .route("/signup")
    .post(userc.addNewUser)

router
    .route("/login")
    .post(userc.loginUser)


module.exports=router;