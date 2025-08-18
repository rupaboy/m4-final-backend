import mongoose from 'mongoose';

const radioSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Radio = mongoose.model( 'radio', radioSchema );

export default Radio