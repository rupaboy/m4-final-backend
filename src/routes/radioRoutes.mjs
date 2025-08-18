import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs';
import {
    createRadioController,
    readAllRadiosController,
    readRadioByIdController,
    readRadiosByCountryController,
    updateRadioByIdController,
    deleteRadioByIdController,
    deleteAllRadiosController
} from '../controllers/radioController.mjs';

const radioRouter = express.Router();

// ADMIN CREATE
radioRouter.post(
    '/',
    authenticateToken,
    hasPermission('create:radios'),
    createRadioController
);

// PUBLIC READ
radioRouter.get(
    '/list',
    readAllRadiosController
);
radioRouter.get(
    '/id/:id',
    readRadioByIdController
);
radioRouter.get(
    '/country/:code',
    readRadiosByCountryController
);

// ADMIN UPDATE
radioRouter.put(
    '/id/:id',
    authenticateToken,
    hasPermission('update:radios'),
    updateRadioByIdController
);

// ADMIN DELETE
radioRouter.delete(
    '/id/:id',
    authenticateToken,
    hasPermission('delete:radios'),
    deleteRadioByIdController
);
radioRouter.delete(
    '/collection/purge',
    authenticateToken,
    hasPermission('delete:radios'),
    deleteAllRadiosController
);

export default radioRouter;
