import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

const userSchema = new Schema({
    fullname: {
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
        type: String || null,
        default: "",
    },
    refreshToken: {
        type: String || null,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
         process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id,
        email: this.email,
        Fullname: this.fullname
        },
         process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};

export const User = mongoose.model("User", userSchema);