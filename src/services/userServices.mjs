import UserRepository from "../repositories/userRepository.mjs";

//CREATE
export async function createNewUser(userData) { //For proper administration
    return await UserRepository.createNew(userData)
}

//READ
export async function readAllUsers() {
    return await UserRepository.readAll()
}

export async function readUserById(id) {
    return await UserRepository.readById(id)
}

export async function readUserByEmail(email) {
    return await UserRepository.readByEmail(email)
}

export async function readUserByUsername(username) {
    return await UserRepository.readByUsername(username)
}

export async function readUserDuplicates(field) {
    return await UserRepository.readDuplicates(field)
}

//UPDATE
export async function updateUserById(id, updateData) {
    return await UserRepository.updateById(id, updateData)
}

//DELETE
export async function deleteUserById(id) {
    return await UserRepository.deleteById(id)
}

export async function deleteByUsernamesAllUsersExceptAdmin() {
    return await UserRepository.deleteByUsernamesAllExceptAdmin()
}

//export async function deleteAllUsers() {
//    return await UserRepository.deleteAll()
//}