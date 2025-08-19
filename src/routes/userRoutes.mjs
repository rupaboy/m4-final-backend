import express from 'express';
import { authenticateToken, hasPermission } from '../middleware/authMiddleware.mjs'

import {initializeRolesAndPermissions} from '../helpers/createRolesAndPermissions.mjs'

//Controllers
import {
    createNewUserController,
    readAllUsersController,
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
userRouter.post( //TESTED
    '/create',
    authenticateToken,
    hasPermission('create:users'),
    createNewUserController
)

//userRouter.post( //TESTED (Tokens keep working') May crash app!
//Needs batch update userDataBase roles _ids.
//May break admin account. //Mandatory server restart.
//    '/collection/initializeroles',
//    authenticateToken,
//    hasPermission('create:users'), //Needs to be commented before using.
//    initializeRolesAndPermissions //This is a very dangerous operation actually.
//)

//ADMIN READ
userRouter.get( //TESTED
    '/list',
    authenticateToken,
    hasPermission('create:users'),
    readAllUsersController
)
userRouter.get( //TESTED
    '/email/:email',
    authenticateToken,
    hasPermission('create:users'),
    readUserByEmailController
)
userRouter.get( //TESTED
    '/duplicates/:field',
    authenticateToken,
    hasPermission('create:users'),
    readUserDuplicatesController
)

//USER READ
userRouter.get( //TESTED LACKS MIDDLEWARE FOR USER CASES
    '/username/:username',
    authenticateToken,
    hasPermission('read:users'),
    readUserByUsernameController
)
userRouter.get(
    '/id/:id', //TESTED LACKS MIDDLEWARE FOR USER CASES
    authenticateToken,
    hasPermission('read:users'),
    readUserByIdController
)

//ADMIN UPDATE
userRouter.put( //TESTING
    '/id/:id',
    authenticateToken,
    hasPermission('update:users'),
    updateUserByIdController
)

//ADMIN DELETE

userRouter.delete( //USE CAREFULLY - You'll still need admin's password and email
    '/collection/allbutadmin', //TESTED
    authenticateToken,
    hasPermission('create:users'),
    deleteByUsernamesAllUsersExceptAdminController
)
//userRouter.delete(      //Should be commented, 'because reasons
//    '/collecion/purge',
//    authenticateToken,
//    hasPermission('delete:users'),
//    deleteAllUsersController
//)

//USER DELETE
userRouter.delete( //TESTED
    '/id/:id',
    authenticateToken,
    hasPermission('delete:users'),
    deleteUserByIdController
)

export default userRouter;