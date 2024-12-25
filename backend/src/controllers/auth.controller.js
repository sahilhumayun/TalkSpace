import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "./generateAccessAndRefreshToken.js";

export const signup = async (req, res) => {
    const {fullname, email, password} = req.body
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    const existedUser = await User.findOne({email})

    if (existedUser) {
        return res.status(400).json({ message: "User already exists with this email" });
    }
    const user = await User.create({
        fullname: fullname.toLowerCase(),
        email,
        password
    })
    if (user) {
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ _id: user._id, email: user.email, fullname: user.fullname })
    }
    else {
        return res.status(400).json({ message: "User not created" });
    }
}