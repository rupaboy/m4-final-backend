import { findRoleByName } from '../services/roleServices.mjs'

import {
    createNewUser,
    readAllUsers,
    readUserById,
    readUserByEmail,
    readUserByUsername,
    readUserDuplicates,
    updateUserById,
    deleteUserById,
    //deleteAllUsers,
    deleteByUsernamesAllUsersExceptAdmin
} from '../services/userServices.mjs'

//CREATE
export async function createNewUserController(req, res) {

    try {
        const { username, email, password, location, role: roleName } = req.body;

        //Validating duplicates
        const existingUser = await readUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });
        // Find given Role
        const role = await findRoleByName(roleName)
        if (!role) return res.status(400).json({ message: `Role "${roleName}" does not exist` });

        const userData = {
            username,
            email,
            password,
            location,
            role: role._id
        };
        const createdUser = await createNewUser(userData)
        return res.status(201).json({
            message: `User ${username} created successfully`,
            user: {
                id: createdUser._id,
                username: createdUser.username,
                email: createdUser.email,
                location: createdUser.location,
                role: role.description
            }
        });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

//READ
export async function readAllUsersController(req, res) {

    try {
        const users = await readAllUsers()
        if (!users.length) {
            return res.status(400).json({
                message: `No users found`
            })
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    }
}

export async function readUserByIdController(req, res) {
    const { id } = req.params

    try {
        const user = await readUserById(id)
        if (user === null) {
            return res.status(400).json({
                message: `No users with id ${id} found`
            })
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    }
}

export async function readUserByEmailController(req, res) {
    const { email } = req.params

    try {
        const user = await readUserByEmail(email)
        if (!user) {
            return res.status(400).json({
                message: `No user with email ${email} found`
            })
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    }
}

export async function readUserByUsernameController(req, res) {
    const { username } = req.params

    try {
        const user = await readUserByUsername(username)
        if (user === null) {
            return res.status(400).json({
                message: `No users with username ${username} found`
            })
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    }
}

export async function readUserDuplicatesController(req, res) {
    const { field } = req.params

    try {
        const userDuplicates = await readUserDuplicates(field)
        if (!userDuplicates) {
            return res.status(400).json({
                message: `No users duplicates with field ${field} found`
            })
        }
        res.status(200).json(userDuplicates);
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    }
}

// UPDATE
export async function updateUserByIdController(req, res) {
    const { id } = req.params;
    const { username, email, password, location, role } = req.body;

    if (username && username.toLowerCase() === 'admin') {
        throw new Error(`Username ${username} reserved for administrator`)
    }
    // Find given Role
        const newRole = await findRoleByName(role)
        if (!newRole) return res.status(400).json({ message: `Role "${newRole}" does not exist` });

        const newRoleId = newRole._id

    //As long as they come in the request
    const updatedData = {
        ...(username && { username }),
        ...(email && { email }),
        ...(password && { password }),
        ...(location && { location }),
        ...(role && { role: newRoleId }),
    };

    try {
        const updatedUser = await updateUserById(id, updatedData);

        if (!updatedUser) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }

        return res.status(200).json({
            message: `User ${updatedUser.username} updated successfully`,
            user: updatedUser
        });
    } catch (error) {
        // Email/Username duplicados
        if (error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}


//DELETE
export async function deleteUserByIdController(req, res) {
    const { id } = req.params
    try {
        const removed = await deleteUserById(id)
        if (!removed) {
            return res.status(400).json({
                message: `Unable to delete user ${id}`
            })
        }
        return res.status(200).json({
            message: `User ${id} deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({
            title: 'Server error',
            error: error.message
        });
    }
}

export async function deleteByUsernamesAllUsersExceptAdminController(req, res) {
    try {
        const deletedAccounts = await deleteByUsernamesAllUsersExceptAdmin()
        if (!deletedAccounts) {
            return res.status(400).json({
                message: "Account 'admin' is safe, but deleting other usernames accounts failed"
            })
        }
        return res.status(200).json({
            message: `Success deleting ${deletedAccounts} accounts! 'admin' account stands alone.`
        })
    } catch (error) {
        console.error("Error deleting all other users than 'admin' username's account")
        return res.status(500).json({
            title: 'Server Error',
            error: error.message
        });
    }
}


export async function deleteAllUsersController(req, res) {
    try {
        const success = await deleteAllUsers()
        if (!success) {
            return res.status(400).json({
                message: "Couldn't drop users collection"
            });
        }
        return res.status(200).json({
            message: "Users collection dropped successfully"
        });
    } catch (error) {
        console.error("Error purging users", error);
        return res.status(500).json({
            title: 'Server Error',
            error: error.message
        });
    }
}
