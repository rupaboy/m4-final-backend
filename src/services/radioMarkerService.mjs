import RadioMarkerRepository from "../repositories/radioMarkerRepository.mjs";
import axios from 'axios';
import 'dotenv/config';

// CREATE
export async function createRadioMarker(markerData) {
    return await RadioMarkerRepository.createNew(markerData);
}

// READ
export async function readAllMarkersByUser(userId) {
    return await RadioMarkerRepository.readAllByUser(userId);
}

export async function readAllMarkersByCountry(id, code) {
    return await RadioMarkerRepository.readAllByCountry(id, code);
}

export async function searchMarkersByName(id, name) {
    return await RadioMarkerRepository.searchByName(id, name);
}

export async function readMarkerById(id) {
    return await RadioMarkerRepository.readById(id);
}

// UPDATE
export async function updateMarkerStatus(id) {
    return await RadioMarkerRepository.updateStatus(id)
}

export async function updateMarkerScore(id, score) {
    return await RadioMarkerRepository.updateScore(id, score);
}


// DELETE
export async function deleteMarkerById(markerId) {
    return await RadioMarkerRepository.deleteById(markerId);
}

export async function deleteAllMarkersByUser(id) {
    return await RadioMarkerRepository.deleteAllByUser(id);
}

// FAVORITES
export async function readFavoriteCountries(id) {
    return await RadioMarkerRepository.readFavoriteCountries(id);
}

// RADIO BROWSER Axios Singleton
export const radioBrowserAPI = axios.create({
        baseURL: process.env.RADIO_BROWSER_API,
        timeout: 5000
    });