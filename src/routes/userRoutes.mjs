import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs'
import { initializeRolesAndPermissions } from '../helpers/createRolesAndPermissions.mjs'

//Validators/Sanitizers
import { validationHandler } from '../validators/validationHandler.mjs';

import {
    idParamValidator,
    codeParamValidator,
    usernameParamValidator,
    emailParamValidator,
    fieldParamValidator
} from '../validators/paramsValidationHelper.mjs';

import {
    userCreateBodyValidator,
    userUpdateBodyValidator
} from '../validators/bodyValidationHelpers.mjs'

//Controllers
import {
    createNewUserController,
    readAllUsersController,
    readUsersByLocationController,
    readUserByIdController,
    readUserByEmailController,
    readUserByUsernameController,
    readUserDuplicatesController,
    updateUserByIdController,
    deleteUserByIdController,
    //deleteAllUsersController,
    deleteByUsernamesAllUsersExceptAdminController
} from '../controllers/userControllers.mjs';

//Router
const userRouter = express.Router();

//ADMIN CREATE
userRouter.post(
    '/create',
    userCreateBodyValidator, validationHandler,
    authenticateToken, hasPermission('create:users'),
    createNewUserController
)

userRouter.post( // (Tokens keep working')
    //Needs batch update userDataBase roles _ids (name stands, role._id corrupts).
    '/collection/initializeroles',
    authenticateToken, hasPermission('create:users'),
    initializeRolesAndPermissions //This is a very dangerous operation actually.
)

//ADMIN READ
userRouter.get(
    '/list',
    authenticateToken, hasPermission('create:users'),
    readAllUsersController
)
userRouter.get(
    '/list/code/:code',
    codeParamValidator, validationHandler,
    authenticateToken, hasPermission('create:users'),
    readUsersByLocationController
)
userRouter.get(
    '/email/:email',
    emailParamValidator, validationHandler,
    authenticateToken, hasPermission('create:users'),
    readUserByEmailController
)
userRouter.get(
    '/duplicates/:field',
    fieldParamValidator, validationHandler,
    authenticateToken, hasPermission('create:users'),
    readUserDuplicatesController
)

//USER READ
userRouter.get(
    '/username/:username',
    usernameParamValidator, validationHandler,
    authenticateToken, hasPermission('read:users'),
    readUserByUsernameController
)
userRouter.get(
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('read:users'),
    readUserByIdController
)

//ADMIN UPDATE
userRouter.put(
    '/id/:id',
    idParamValidator, userUpdateBodyValidator, validationHandler,
    authenticateToken, hasPermission('update:users'),
    updateUserByIdController
)

//ADMIN DELETE
userRouter.delete( //USE CAREFULLY - You'll still need admin's password and email
    '/collection/allbutadmin', //
    authenticateToken, hasPermission('create:users'),
    deleteByUsernamesAllUsersExceptAdminController
)
//userRouter.delete(      //Should be commented, 'because reasons
//    '/collecion/purge',
//    authenticateToken,
//    hasPermission('delete:users'),
//    deleteAllUsersController
//)

//USER DELETE
userRouter.delete(
    '/id/:id',
    idParamValidator, validationHandler,
    authenticateToken, hasPermission('delete:users'),
    deleteUserByIdController
)

export default userRouter;