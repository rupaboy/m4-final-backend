import express from 'express';
import userRoutes from './userRoutes.mjs'
import countryRoutes from './countryRoutes.mjs'
import authRoutes from './authRoutes.mjs'

const router = express.Router();

//Rutas
router.use('/country', countryRoutes );
router.use('/user', userRoutes )
router.use('/auth', authRoutes )

export default router;