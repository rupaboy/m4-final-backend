import express from 'express';

//Controllers
import {
    register,
    login
} from '../controllers/authController.mjs';

//Router
const authRouter = express.Router();

//POST
authRouter.post( '/signup', register )
authRouter.post( '/signin', login )

export default authRouter;