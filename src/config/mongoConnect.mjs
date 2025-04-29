import mongoose from 'mongoose';

export async function mongoConnect() {
    try {
        await mongoose.connect('mongodb+srv://Grupo-08:grupo08@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('Conectado a MongoDB')
    } catch (error) {
        console.log('Error conectando a MongoDB: ', error)
        process.exit(1)
    }
};