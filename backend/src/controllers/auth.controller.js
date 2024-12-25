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
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
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
        .json({ _id: user._id, email: user.email, fullname: user.fullname, message: "User created successfully" })
    }
    else {
        return res.status(400).json({ message: "User not created" });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ _id: user._id, email: user.email, fullname: user.fullname , message: "Login successful" })
}
export const logout = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { 
        $set: {refreshToken: "" }
    },{
        new: true,
    })
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Logged out successfully" })
}  

export const updateProfileDetails = async (req, res) => {
    const {fullname, email} = req.body
    if (!fullname || !email) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set:{
        fullname: fullname.toLowerCase(),
        email,
    }}, {
        new: true,
    }).select("-password")
    return res
    .status(201)
    .json({email: user.email, fullname: user.fullname, message: "Profile updated successfully" })


}
