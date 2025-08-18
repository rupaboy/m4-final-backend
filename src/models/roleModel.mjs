import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'permission'
    }]
}, { timestamps: true });

const Role = mongoose.model(
    'role', roleSchema
);
export default Role