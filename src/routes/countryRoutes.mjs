import express from 'express';

//Express-Validator
import { validationHandler } from '../validators/validationHandler.mjs'

//Validators.
import {
    countrySanitizer,
    countryValidations
} from '../validators/countriesValidationHelpers.mjs'

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

router.get( '/countries/add', addNewCountryController )

router.get( '/countries/edit/:id', editCountryController )

router.get( '/countries/remove/:id', removeCountryController )

router.get( '/countries/:id', getCountryByIdController )

//POST
router.post( '/countries/new',
    countrySanitizer(),
    countryValidations(),
    validationHandler,
    postCountryController )

//PUT
router.put( '/countries/set/:id',
    countrySanitizer(),
    countryValidations(),
    validationHandler,
    editCountryByIdController )


//DELETE
//router.delete( '/countries/remove-all', removeAllCountriesController )

router.delete( '/countries/remove/:id', removeCountryByIdController )

export default router;