import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "./generateAccessAndRefreshToken.js";

//conroller for signup, login and logout
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
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        return res.status(400).json({ message: "Please upload an avatar" });
    }
    const avatar =  await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        return res.status(500).json({ message: "PLease Upload an avatar" });
    }
    const user = await User.create({
        fullname: fullname.toLowerCase(),
        email,
        password,
        avatar,
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
        .json({ _id: user._id, email: user.email, fullname: user.fullname, avatar: user.avatar, message: "User created successfully" })
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

//controller for updating profile details and avatar
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
export const updateProfileAvatar = async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        return res.status(400).json({ message: "Please upload an avatar" });
    }
    const avatar =  await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        return res.status(500).json({ message: "PLease Upload an avatar" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set:{
        avatar,
    }}, {
        new: true,
    }).select("-password")
    return res
    .status(201)
    .json({email: user.email, fullname: user.fullname, avatar: user.avatar, message: "Avatar updated successfully" })
}

//controller for checking auth
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({ message: "User is authenticated" },req.user);
    } catch (error) {
        console.log("Error in checkAuth", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
