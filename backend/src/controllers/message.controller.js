import {Message} from "../models/message.model.js"; 
import {User} from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
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
        const { id } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: id },
                { sender: id, receiver: senderId },
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
        const {text} = req.body;
        const { id } = req.params;
        const senderId = req.user._id;
        const imageLocalPath = req.file?.path;
        const image = await uploadOnCloudinary(imageLocalPath);
        const message = await Message.create({
            sender: senderId,
            receiver: id,
            text,
            image,
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
export const SideBarUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const sendmessage  = await Message.find({sender: userId}).populate("receiver", " fullname avatar");
        const receivedMessage = await Message.find({receiver: userId}).populate("sender", "fullname avatar");
        const sentUsers = [...new Set(sendmessage.map(message => message.sender._id.toString()))];
        const receivedUsers = [...new Set(receivedMessage.map(message => message.receiver._id.toString()))];
        const allUsers = [...new Set([...sentUsers, ...receivedUsers])];
        const usersWithDetails = await User.find({ '_id': { $in: allUsers } });
        return res.status(200).json(usersWithDetails);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ message: "Failed to get users" });
    }
}