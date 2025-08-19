import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs';
import {
    createRadioMarkerController,
    readAllMarkersByUserController,
    readAllMarkersByCountryController,
    searchMarkersByNameController,
    readMarkerByIdController,
    updateMarkerScoreController,
    deleteMarkerByIdController,
    deleteAllMarkersByUserController,
    createTagController,
    deleteTagController,
    updateTagController,
    updateTagsController,
    readFavoriteCountriesController,
    browseRadiosByCountryCode
} from '../controllers/radioMarkerControllers.mjs';

const radioMarkerRouter = express.Router();

// CREATE
radioMarkerRouter.post(
    '/',
    authenticateToken,
    hasPermission('create:radioMarkers'),
    createRadioMarkerController
);

// READ
radioMarkerRouter.get(
    '/user/:userId',
    authenticateToken,
    readAllMarkersByUserController
);
radioMarkerRouter.get(
    '/user/:userId/country/:countrycode',
    authenticateToken,
    readAllMarkersByCountryController
);
radioMarkerRouter.get(
    '/user/:userId/search',
    authenticateToken,
    searchMarkersByNameController
);
radioMarkerRouter.get(
    '/id/:id',
    authenticateToken,
    readMarkerByIdController
);

// FAVORITES
radioMarkerRouter.get(
    '/user/:userId/favorites',
    authenticateToken,
    readFavoriteCountriesController
);

// UPDATE
radioMarkerRouter.put(
    '/id/:id/score',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    updateMarkerScoreController
);

// TAGS
radioMarkerRouter.put(
    '/id/:id/tag/add',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    createTagController
);
radioMarkerRouter.put(
    '/id/:id/tag/remove',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    deleteTagController
);
radioMarkerRouter.put(
    '/id/:id/tag/update',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    updateTagController
);
radioMarkerRouter.put(
    '/id/:id/tags/set',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    updateTagsController
);

// DELETE
radioMarkerRouter.delete(
    '/id/:id',
    authenticateToken,
    hasPermission('delete:radioMarkers'),
    deleteMarkerByIdController
);
radioMarkerRouter.delete(
    '/user/:userId/purge',
    authenticateToken,
    hasPermission('delete:radioMarkers'),
    deleteAllMarkersByUserController
);

radioMarkerRouter.get(
    '/browser/country/:countryCode',
    authenticateToken,
    browseRadiosByCountryCode,
);

export default radioMarkerRouter;
