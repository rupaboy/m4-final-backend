import CountryMarkerRepository from "../repositories/countryMarkerRepository.mjs";

// CREATE
export async function createCountryMarker(markerData) {
    return await CountryMarkerRepository.createNew(markerData);
}

// READ
export async function readAllCountryMarkersByUser(userId) {
    return await CountryMarkerRepository.readAllByUser(userId);
}

export async function readCountryMarkerByUserAndCode(userId, code) {
    return await CountryMarkerRepository.readByCountryAndUser(userId, code);
}

// DELETE
export async function deleteCountryMarkerById(markerId) {
    return await CountryMarkerRepository.deleteById(markerId);
}

export async function deleteAllCountryMarkersByUser(userId) {
    return await CountryMarkerRepository.deleteAllByUser(userId);
}
