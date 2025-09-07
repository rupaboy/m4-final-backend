import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs';

//Validators/Sanitizers
import { validationHandler } from '../validators/validationHandler.mjs';

import {
    idParamValidator,
    pageParamValidator,
    codeParamValidator,
    nameParamValidator,
    scoreParamValidator
} from '../validators/paramsValidationHelper.mjs';

import {
    radioCreateBodyValidator,
} from '../validators/bodyValidationHelpers.mjs'

import {
    createRadioMarkerController,
    readAllMarkersByUserController,
    readAllMarkersByCountryController,
    searchMarkersByNameController,
    readMarkerByIdController,
    updateMarkerStatusController,
    updateMarkerScoreController,
    deleteMarkerByIdController,
    deleteAllMarkersByUserController,
    readFavoriteCountriesController,
    searchRadiosByCountryCodeAndName,
    browseRadiosByCountryCode
} from '../controllers/radioMarkerControllers.mjs';

const radioMarkerRouter = express.Router();

// CREATE
radioMarkerRouter.post(
    '/create',
    radioCreateBodyValidator, validationHandler,
    authenticateToken,
    hasPermission('create:radios'),
    createRadioMarkerController
);

// READ PUBLIC
radioMarkerRouter.get(
    '/browse/:code',
    codeParamValidator, validationHandler,
    browseRadiosByCountryCode,
);

radioMarkerRouter.get(
    '/browse/:code/:page', //Page is optional
    codeParamValidator, pageParamValidator, validationHandler,
    browseRadiosByCountryCode,
);

radioMarkerRouter.get(
    '/search/:code/:name/:page', //Page is optional
    codeParamValidator, pageParamValidator, nameParamValidator, validationHandler,
    searchRadiosByCountryCodeAndName,
);
// READ USER
radioMarkerRouter.get(
    '/user/:id/list',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('read:radios'),
    readAllMarkersByUserController
);
radioMarkerRouter.get(
    '/user/:id/country/:code',
    idParamValidator, codeParamValidator, validationHandler,
    authenticateToken,
    hasPermission('read:radios'),
    readAllMarkersByCountryController
);
radioMarkerRouter.get(
    '/namesearch/:id/:name',
    idParamValidator, nameParamValidator, validationHandler,
    authenticateToken,
    hasPermission('read:radios'),
    searchMarkersByNameController
);
radioMarkerRouter.get(
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken,
    hasPermission('read:radios'),
    readMarkerByIdController
);

// FAVORITES
radioMarkerRouter.get(
    '/user/:id/countries',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('read:radios'),
    readFavoriteCountriesController
);

// UPDATE
radioMarkerRouter.put(
    '/refresh/:id',
    idParamValidator, radioCreateBodyValidator, validationHandler,
    authenticateToken, hasPermission('update:radios'),
    updateMarkerStatusController,
);
radioMarkerRouter.put(
    '/score/:id/:score',
    idParamValidator, scoreParamValidator, validationHandler,
    authenticateToken, hasPermission('update:radios'),
    updateMarkerScoreController
);

// DELETE
radioMarkerRouter.delete(
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken,
    hasPermission('delete:radios'),
    deleteMarkerByIdController
);
radioMarkerRouter.delete(
    '/user/:id/purge',
    idParamValidator, validationHandler,
    authenticateToken,
    hasPermission('delete:radios'),
    deleteAllMarkersByUserController
);

export default radioMarkerRouter;
