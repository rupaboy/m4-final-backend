import mongoose from "mongoose";

const countryMarkerSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const CountryMarker = mongoose.model( 'countryMarker', countryMarkerSchema );

export default CountryMarker