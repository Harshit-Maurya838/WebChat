import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserFrSidebar = async(req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filterUsers)
    } catch (error) {
        console.log("Error in getUserFrSidebar", error)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const getMessage = async(req,res) =>{
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId}
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessage", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const sendMessage = async(req,res) =>{
    try {
        const { id:recieverId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })

        await newMessage.save();
        const receiverSocketId = getReceiverSocketId(recieverId);
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}