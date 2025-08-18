import RadioMarkerRepository from "../repositories/radioMarkerRepository.mjs";

// CREATE
export async function createRadioMarker(markerData) {
    return await RadioMarkerRepository.createNew(markerData);
}

// READ
export async function readAllMarkersByUser(userId) {
    return await RadioMarkerRepository.readAllByUser(userId);
}

export async function readMarkerById(markerId) {
    return await RadioMarkerRepository.readById(markerId);
}

// UPDATE
export async function updateMarkerScore(markerId, score) {
    return await RadioMarkerRepository.updateScore(markerId, score);
}

// DELETE
export async function deleteMarkerById(markerId) {
    return await RadioMarkerRepository.deleteById(markerId);
}

export async function deleteAllMarkersByUser(userId) {
    return await RadioMarkerRepository.deleteAllByUser(userId);
}
