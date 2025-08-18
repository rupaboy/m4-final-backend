import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs';
import {
    createCountryMarkerController,
    readAllCountryMarkersByUserController,
    readCountryMarkerByUserAndCodeController,
    deleteCountryMarkerByIdController,
    deleteAllCountryMarkersByUserController
} from '../controllers/countryMarkerController.mjs';

const countryMarkerRouter = express.Router();

// AUTHENTICATED CREATE
countryMarkerRouter.post(
    '/',
    authenticateToken,
    hasPermission('create:countryMarkers'),
    createCountryMarkerController
);

// AUTHENTICATED READ
countryMarkerRouter.get(
    '/user/:userId',
    authenticateToken,
    readAllCountryMarkersByUserController
);
countryMarkerRouter.get(
    '/user/:userId/code/:code',
    authenticateToken,
    readCountryMarkerByUserAndCodeController
);

// AUTHENTICATED DELETE
countryMarkerRouter.delete(
    '/id/:id',
    authenticateToken,
    hasPermission('delete:countryMarkers'),
    deleteCountryMarkerByIdController
);
countryMarkerRouter.delete(
    '/user/:userId/purge',
    authenticateToken,
    hasPermission('delete:countryMarkers'),
    deleteAllCountryMarkersByUserController
);

export default countryMarkerRouter;
