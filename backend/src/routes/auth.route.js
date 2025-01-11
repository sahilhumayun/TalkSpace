import express from "express";
import { login, logout, signup, updateProfileAvatar,checkAuth } from "../controllers/auth.controller.js";
import { verfiyJWT } from "../middleware/auth.middleware.js";


const router = express.Router()

router.post("/signup",signup)

router.post("/login",login)
router.post("/logout", verfiyJWT,logout)
router.put("/update-avatar",verfiyJWT,updateProfileAvatar)
router.get("/check",verfiyJWT, checkAuth)

export default router