import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verfiyJWT =async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ","");

        if (!token) {
            return res.status(401).json({message:"Unauthenticated"})
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password")
        if (!user) {
            return res.status(401).json({message:"Invalid token"})
        }
        req.user = user
        next();

    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(401).json({message: `${error.message}`})
    }
}