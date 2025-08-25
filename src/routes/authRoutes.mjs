import express from 'express';

//Validators/Sanitizers
import { validationHandler } from '../validators/validationHandler.mjs';

import {
    userCreateBodyValidator,
    userUpdateBodyValidator
} from '../validators/bodyValidationHelpers.mjs'



//Controllers
import {
    register,
    login
} from '../controllers/authControllers.mjs';

//Router
const authRouter = express.Router();

//POST
authRouter.post(
    '/signup',
    userCreateBodyValidator, validationHandler,
    register
)

authRouter.post(
    '/signin',
    userUpdateBodyValidator, validationHandler,
    login
)

export default authRouter;