import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs'

//Validators/Sanitizers
import { validationHandler } from '../validators/validationHandler.mjs';

import {
    idParamValidator,
    codeParamValidator,
    nameParamValidator,
} from '../validators/paramsValidationHelper.mjs';

//Controllers
import {
    createCountryController,
    createAllCountriesController,
    readAllCountriesController,
    readCountryByIdController,
    readCountryByCodeController,
    readCountryCapitalImage,
    readCountryDuplicatesController,
    updateCountryByCodeController,
    deleteCountryByIdController,
    deleteAllCountriesController,
} from '../controllers/countryControllers.mjs';

//Router
const countryRouter = express.Router();


//ADMIN CREATE___________________________________________
countryRouter.post( //Tested
    '/collection/populate',
    authenticateToken, hasPermission('create:countries'),
    createAllCountriesController
)
countryRouter.post(
    '/code/:code', //Tested
    codeParamValidator, validationHandler,
    authenticateToken, hasPermission('create:countries'),
    createCountryController,
)

//PUBLIC READ___________________________________________
countryRouter.get( //Tested
    '/list',
    readAllCountriesController
)
countryRouter.get( //Tested
    '/code/:code',
    codeParamValidator, validationHandler,
    readCountryByCodeController
) // not-MongoObjIds but CCA2 country code

countryRouter.get(
    '/image/:name',
    nameParamValidator, validationHandler,
    readCountryCapitalImage
)

//ADMIN READ_____________________________________________
countryRouter.get(  //Tested
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('update:countries'),
    readCountryByIdController
)
countryRouter.get( //Tested
    '/collection/duplicates',
    authenticateToken, hasPermission('update:countries'),
    readCountryDuplicatesController
)

//ADMIN UPDATE___________________________________________
countryRouter.put( //Tested
    '/code/:code',
    codeParamValidator, validationHandler,
    authenticateToken, hasPermission('update:countries'),
    updateCountryByCodeController
)

//ADMIN DELETE___________________________________________
countryRouter.delete( //Tested
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('delete:countries'),
    deleteCountryByIdController,
)
countryRouter.delete( //Tested
    '/collection/purge',
    authenticateToken, hasPermission('delete:countries'),
    deleteAllCountriesController
)

export default countryRouter;