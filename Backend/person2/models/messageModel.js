import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    isRead: {
        type:Boolean,
        default:false
    }
},{timestamps:true}) //{timestamps:true} =>this give createdAt and updeatedAt information

const Message = mongoose.model('Message',messageSchema)

export default Message