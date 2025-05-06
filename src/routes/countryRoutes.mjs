import express from 'express';

//Express-Validator
import { validationHandler } from '../validators/validationHandler.mjs'
//Agregar validators.

//Controllers
import {
    //removeAllCountriesController,
    getAllCountriesController,
    getCountryByIdController,
    addNewCountryController,
    editCountryController,
    removeCountryController,
    postCountryController,
    editCountryByIdController,
    removeCountryByIdController,
} from '../controllers/countryControllers.mjs';

//Router
const router = express.Router();

//GET
router.get( '/countries', getAllCountriesController )

router.get( '/countries/:id', getCountryByIdController )

router.get( '/countries/add', addNewCountryController )

router.get( '/countries/edit/:id', editCountryController )

router.get( '/countries/remove/:id', removeCountryController )

//POST
router.post( '/countries/add', postCountryController )

//PUT
router.put( '/countries/edit/:id', editCountryByIdController )


//DELETE
//router.delete( '/countries/remove-all', removeAllCountriesController )

router.delete( '/countries/remove/:id', removeCountryByIdController )

export default router;