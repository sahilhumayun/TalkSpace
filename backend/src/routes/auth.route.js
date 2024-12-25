import express from "express";
import { login, logout, signup, updateProfileDetails } from "../controllers/auth.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";


const router = express.Router()

router.post("/signup", signup)

router.post("/login",login)
router.post("/logout", verfiyJWT,logout)
router.put("/update-Profile",verfiyJWT,updateProfileDetails)


export default router