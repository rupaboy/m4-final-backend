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

export async function readAllMarkersByCountry(userId, countryCode) {
    return await RadioMarkerRepository.readAllByCountry(userId, countryCode);
}

export async function searchMarkersByName(userId, query) {
    return await RadioMarkerRepository.searchByName(userId, query);
}

export async function readMarkerById(markerId) {
    return await RadioMarkerRepository.readById(markerId);
}

// UPDATE
export async function updateMarkerScore(markerId, score) {
    return await RadioMarkerRepository.updateScore(markerId, score);
}

// TAGS
export async function createMarkerTag(markerId, newTag) {
    return await RadioMarkerRepository.createTag(markerId, newTag);
}

export async function deleteMarkerTag(markerId, tagToRemove) {
    return await RadioMarkerRepository.deleteTag(markerId, tagToRemove);
}

export async function updateMarkerTag(markerId, oldTag, newTag) {
    return await RadioMarkerRepository.updateTag(markerId, oldTag, newTag);
}

export async function updateMarkerTags(markerId, tagsArray) {
    return await RadioMarkerRepository.updateTags(markerId, tagsArray);
}

// DELETE
export async function deleteMarkerById(markerId) {
    return await RadioMarkerRepository.deleteById(markerId);
}

export async function deleteAllMarkersByUser(userId) {
    return await RadioMarkerRepository.deleteAllByUser(userId);
}

// FAVORITES
export async function readFavoriteCountries(userId) {
    return await RadioMarkerRepository.readFavoriteCountries(userId);
}

// RADIO BROWSER Axios Singleton
export const radioBrowserAPI = axios.create({
        baseURL: process.env.RADIO_BROWSER_API,
        timeout: 5000
    });