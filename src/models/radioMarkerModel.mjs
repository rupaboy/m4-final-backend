import mongoose from 'mongoose';

const radioMarkerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    radio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "radio",
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, { timestamps: true });

const RadioMarker = mongoose.model( 'radioMarker', radioMarkerSchema );

export default RadioMarker