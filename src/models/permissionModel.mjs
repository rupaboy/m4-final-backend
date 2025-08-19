import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

const Permission = mongoose.model(
    'permission',
    permissionSchema,
    'permissions'
);
export default Permission