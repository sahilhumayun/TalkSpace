import {Message} from "../models/message.model.js"; 
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.js"

export const SideBarUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ message: "Failed to get all users" });       
    }
}   
export const getMessages = async (req, res) => {
    try {
        const { id:UserId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: UserId },
                { senderId: UserId, receiverId: myId },
            ],
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ message: "Failed to get messages" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const uploadresposne = await uploadOnCloudinary(image);
        const message = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            text,
            image: uploadresposne,
        });
        if (!message) {
            return res.status(400).json({ message: "Message not sent" });
        }


        return res.status(201).json(message);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ message: "Failed to send message" });
    }
}
