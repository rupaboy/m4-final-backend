//import {apiRestConsumer} from './helpers/restCountriesToCollection.mjs'
import express from 'express';


//Express-Validator
import { validationHandler } from '../validators/validationHandler.mjs'
//Agregar validators.

//Controllers
import {
    //deleteAllCountriesController,
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

//Helper
//app.get('/api/restconsumer', async (req,res) => { apiRestConsumer() });


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

router.delete( '/countries/remove/:id', removeCountryByIdController )


//router.remove( 'countries/remove/all', removeAllCountriesController )


export default router;