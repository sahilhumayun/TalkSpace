import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);