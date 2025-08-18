import mongoose from 'mongoose';

export async function mongoConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB')
    } catch (error) {
        console.log('Error conectando a MongoDB: ', error)
        process.exit(1)
    }
};