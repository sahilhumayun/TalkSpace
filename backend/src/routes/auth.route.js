import express from "express";

const router = express.Router

router.get("/signup",(req,res)=>{
    res.send("signup user")
})
router.get("/login",(req,res)=>{
    res.send("login user")
})
router.get("/logout",(req,res)=>{
    res.send("logout user")
})

export default router