import express from 'express';

//Express-Validator
import { validationHandler } from '../validators/validationHandler.mjs'
//Agregar validators.

//Controllers
import {
    getSpanishSpeakingCountriesController,
} from '../controllers/spanishControllers.mjs';

//Router

const router = express.Router();

router.get('/spanish', getSpanishSpeakingCountriesController)


export default router;