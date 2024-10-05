import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ArtiSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    respectors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artiest'
        }
    ],
    respecting: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artiest'
        }
    ]
}, { timestamps: true });

const Arti = mongoose.model('Arti', ArtiSchema,'artiest');

export default Arti;
