import express from "express";
import { login, logout, signup, updateProfileAvatar, updateProfileDetails } from "../controllers/auth.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";
import { upload } from "./../middleware/multer.middleware.js"


const router = express.Router()

router.post("/signup",upload.single("avatar") ,signup)

router.post("/login",login)
router.post("/logout", verfiyJWT,logout)
router.put("/update-Profile",verfiyJWT,updateProfileDetails)
router.put("/update-avatar",verfiyJWT,upload.single("avatar"),updateProfileAvatar)

export default router