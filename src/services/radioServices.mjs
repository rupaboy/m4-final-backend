import RadioRepository from "../repositories/radioRepository.mjs";

// CREATE
export async function createRadio(radioData) {
    return await RadioRepository.createNew(radioData);
}

// READ
export async function readAllRadios() {
    return await RadioRepository.readAll();
}

export async function readRadioById(id) {
    return await RadioRepository.readById(id);
}

export async function readRadiosByCountry(code) {
    return await RadioRepository.readByCountry(code);
}

// UPDATE
export async function updateRadioById(id, updateData) {
    return await RadioRepository.updateById(id, updateData);
}

// DELETE
export async function deleteRadioById(id) {
    return await RadioRepository.deleteById(id);
}

export async function deleteAllRadios() {
    return await RadioRepository.deleteAll();
}
