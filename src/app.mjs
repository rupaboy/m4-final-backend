import 'dotenv/config';
import express from 'express';
import router from './routes/routesIndex.mjs'
import { mongoConnect } from './config/mongoConnect.mjs';
import cors from 'cors'

//Express instance
const app = express();

const corsSettings = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
} //24 hs

//Middleware
app.use(cors(corsSettings));
app.use(express.json()); //JSON obj processor
app.use(express.urlencoded({ extended: true })); //For PostMan testing

//Routes
app.use('/api/', router);

//Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() })
})

//Enviroment variable PORT or localhost:3000.
const PORT = process.env.PORT || 3000;

/*
//Public Static Files Server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public')));
*/

//404
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        details: 'The requested resource does not exist'
    });
});

//MongoDB connection
mongoConnect();

//Launch Express Server
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto: ', PORT)
});

