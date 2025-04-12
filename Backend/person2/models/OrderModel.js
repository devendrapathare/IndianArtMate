import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema ({
    buyerId:{
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        // enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    payment: {
        type: Boolean,
        default: false
    },
    // bidId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default:''
    // },
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);

export default orderModel