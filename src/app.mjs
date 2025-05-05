import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import router from './routes/countryRoutes.mjs';
import { mongoConnect } from './config/mongoConnect.mjs';
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';

//Instanciar express
const app = express();

//Asignar puerto abierto, ó 3000 en localhost.
const PORT = process.env.PORT || 3000;

//Obtener el directorio del módulo PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //View Engine

//Middleware
app.use(express.json()); //Para procesar objetos JSON
app.use(express.urlencoded()); //Para obtener valores de elementos del body
app.use(methodOverride('_method')); //PUT y DELETE en formularios HTML
app.use(expressEjsLayouts);
app.set('layout', 'layout');


//Rutas
app.use('/api/', router);

//Manejo de errores para rutas no encontradas
app.use((req,res,next) => {
    res.send('404')
});

//Conectar a MongoDB
mongoConnect();

//Iniciar el server de express
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto: ', PORT )
});

