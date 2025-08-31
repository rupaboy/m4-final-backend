import mongoose from "mongoose";

const radioMarkerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stationuuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // <-- ARRAY of strings. Sanitize API response: .split(',').
        default: []
    },
    score: {
        type: Number,
        min: 0,
        max: 5,
        default: null
    },
    url_resolved: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: ""
    },
    countryCode: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

// índices
radioMarkerSchema.index({ user: 1, stationuuid: 1 }, { unique: true });
radioMarkerSchema.index({ countryCode: 1 });
radioMarkerSchema.index({ name: 1 });

const RadioMarker = mongoose.model('radioMarker', radioMarkerSchema, 'radioMarkers');

export default RadioMarker;
