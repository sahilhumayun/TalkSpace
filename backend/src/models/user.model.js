import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    Fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required with minimum length of 6 characters"],
        minlength: 6,
    },
    avatar: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);