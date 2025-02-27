import mongoose, { mongo } from 'mongoose';

const messageSchama = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String, 
    },
    image: {
        type: String, 
    }  
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchama)

export default Message;