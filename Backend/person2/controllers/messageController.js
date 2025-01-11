import Conversation from "../models/conversationModel.js"
import Message from '../models/messageModel.js'
import { getReceiverSocketId, io } from "../../socket.js"
import User from "../models/userModels.js"
import mongoose from "mongoose"

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        // console.log('messge', req.params);
        const { id: receiverId } = req.params
        const senderId = req.user._id



        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        // This is not right approach because in this await conversation.save() this will run first and then other one but we want that the both should run in parallel 
        // await conversation.save()
        // await newMessage.save()

        // To make them run in parallel we will use promise
        await Promise.all([conversation.save(), newMessage.save()])

        // socket io functionality here
        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }
        console.log('receiverId', receiverId);
        console.log('receiverSocketId', receiverSocketId);




        res.status(201).json(newMessage)
        // console.log('newMessage',newMessage);


    } catch (error) {
        console.log("Error in messageController sendMessage:", error.message);

        // io.to(<specific_id>).emit() is uded to send events tospecific client
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessage = async (req, res) => {
    try {

        const { id: userToChatId } = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages") //Using this we will get the full message array not only reference like [
        //     "66d1ec5c8a116a25090fd7ed",
        //     "66d1ed278a116a25090fd7f2"
        // ]
        // so using this we will get full like this 
        // {
        //     "_id": "66d1ed278a116a25090fd7f2",
        //     "senderId": "66d08f2a7669ff16aede7396",
        //     "receiverId": "66d076e251e540da0d80874d",
        //     "message": "Jai Shree Ram",
        //     "createdAt": "2024-08-30T16:02:47.038Z",
        //     "updatedAt": "2024-08-30T16:02:47.038Z",
        //     "__v": 0
        // }

        if (!conversation) {
            return res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)
        // console.log('getMemessages',messages);


    } catch (error) {
        console.log("Error in messageController getMessage", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const MessageReceiverDetails = async (req, res) => {

    const { id: receiverId } = req.params;

    try {

        const receiverDetails = await User.findById(receiverId).select('-password')

        if (!receiverDetails) {
            return res.status(404).json({ error: "Receiver not found" })
        }

        res.status(200).json(receiverDetails)
        // console.log(receiverDetails);
        

    } catch (error) {
        console.log("Error in messageController MessageReceiverDetails", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export const getUserAllConversations = async (req,res) => {
    
    const {id:userId} = req.params;

    try {

        const response = await Conversation.find({
            participants: new mongoose.Types.ObjectId(userId)
        })

        if (response.length === 0) {
            return res.status(404).json({ error: "No conversations found" })
        }

        res.status(200).json(response);
        // console.log(response);
        
    } catch (error) {
        console.log("Error in messageController getUserAllConversations", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export const getUserLastMessage = async (req,res) => {
    
    const {id:messageId} = req.params;

    try {

        const response = await Message.findById(messageId)
        res.status(200).json(response);
        // console.log(response);
        
    } catch (error) {
        console.log("Error in messageController getUserLastMessage", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
    
}