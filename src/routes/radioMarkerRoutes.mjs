import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs';
import {
    createRadioMarkerController,
    readAllMarkersByUserController,
    readMarkerByIdController,
    updateMarkerScoreController,
    deleteMarkerByIdController,
    deleteAllMarkersByUserController
} from '../controllers/radioMarkerController.mjs';

const radioMarkerRouter = express.Router();

// AUTHENTICATED CREATE
radioMarkerRouter.post(
    '/',
    authenticateToken,
    hasPermission('create:radioMarkers'),
    createRadioMarkerController
);

// AUTHENTICATED READ
radioMarkerRouter.get(
    '/user/:userId',
    authenticateToken,
    readAllMarkersByUserController
);
radioMarkerRouter.get(
    '/id/:id',
    authenticateToken,
    readMarkerByIdController
);

// AUTHENTICATED UPDATE
radioMarkerRouter.put(
    '/id/:id/score',
    authenticateToken,
    hasPermission('update:radioMarkers'),
    updateMarkerScoreController
);

// AUTHENTICATED DELETE
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

export default radioMarkerRouter;
