import mongoose from "mongoose";
import Role from "./roleModel.mjs";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Email inválido']
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    }
}, { timestamps: true });

const User = mongoose.model(
    'user',
    userSchema,
    'users'
);
export default User

