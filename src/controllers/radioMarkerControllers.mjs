import RadioMarker from "../models/radioMarkerModel.mjs";
import {
    createRadioMarker,
    readAllMarkersByUser,
    readAllMarkersByCountry,
    searchMarkersByName,
    readMarkerById,
    updateMarkerScore,
    deleteMarkerById,
    deleteAllMarkersByUser,
    createMarkerTag,
    deleteMarkerTag,
    updateMarkerTag,
    updateMarkerTags,
    readFavoriteCountries,
    radioBrowserAPI
} from "../services/radioMarkerService.mjs";

// CREATE
export async function createRadioMarkerController(req, res) {
    try {
        const marker = await createRadioMarker(req.body);
        return res.status(201).json({ message: "Radio marker created successfully", marker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

// READ
export async function readAllMarkersByUserController(req, res) {
    try {
        const markers = await readAllMarkersByUser(req.params.userId);
        if (!markers.length) return res.status(404).json({ message: "No markers found for user" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function readAllMarkersByCountryController(req, res) {
    try {
        const markers = await readAllMarkersByCountry(req.params.userId, req.params.countrycode);
        if (!markers.length) return res.status(404).json({ message: "No markers found for this country" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function searchMarkersByNameController(req, res) {
    try {
        const markers = await searchMarkersByName(req.params.userId, req.query.q);
        if (!markers.length) return res.status(404).json({ message: "No markers found matching the query" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function readMarkerByIdController(req, res) {
    try {
        const marker = await readMarkerById(req.params.id);
        if (!marker) return res.status(404).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json(marker);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

// UPDATE
export async function updateMarkerScoreController(req, res) {
    try {
        const updated = await updateMarkerScore(req.params.id, req.body.score);
        if (!updated) return res.status(404).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json({ message: "Marker score updated successfully", marker: updated });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

// TAGS
export async function createTagController(req, res) {
    try {
        const { markerId, newTag } = req.body;
        const updatedMarker = await createMarkerTag(markerId, newTag);
        if (!updatedMarker) return res.status(404).json({ message: `Marker with id ${markerId} not found` });
        return res.status(200).json({ message: "Tag added successfully", marker: updatedMarker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function deleteTagController(req, res) {
    try {
        const { markerId, tagToRemove } = req.body;
        const updatedMarker = await deleteMarkerTag(markerId, tagToRemove);
        if (!updatedMarker) return res.status(404).json({ message: `Marker with id ${markerId} not found` });
        return res.status(200).json({ message: "Tag removed successfully", marker: updatedMarker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function updateTagController(req, res) {
    try {
        const { markerId, oldTag, newTag } = req.body;
        const updatedMarker = await updateMarkerTag(markerId, oldTag, newTag);
        if (!updatedMarker) return res.status(404).json({ message: `Marker with id ${markerId} or tag not found` });
        return res.status(200).json({ message: "Tag updated successfully", marker: updatedMarker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function updateTagsController(req, res) {
    try {
        const { markerId, tagsArray } = req.body;
        const updatedMarker = await updateMarkerTags(markerId, tagsArray);
        if (!updatedMarker) return res.status(404).json({ message: `Marker with id ${markerId} not found` });
        return res.status(200).json({ message: "Tags replaced successfully", marker: updatedMarker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

// DELETE
export async function deleteMarkerByIdController(req, res) {
    try {
        const deleted = await deleteMarkerById(req.params.id);
        if (!deleted) return res.status(404).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json({ message: "Marker deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function deleteAllMarkersByUserController(req, res) {
    try {
        await deleteAllMarkersByUser(req.params.userId);
        return res.status(200).json({ message: "All markers for user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

// FAVORITES
export async function readFavoriteCountriesController(req, res) {
    try {
        const countries = await readFavoriteCountries(req.params.userId);
        if (!countries.length) return res.status(404).json({ message: "No favorite countries found for user" });
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function browseRadiosByCountryCode(req, res) {
        try {
            const { countryCode } = req.params;

            // Brings radios by country
            const { data: stations } = await radioBrowserAPI.get(
                `/stations/bycountrycodeexact/${countryCode.toLowerCase()}`
            );

            // Brings marked by user
            const userMarkers = await RadioMarker.find({
                user: req.user.id,
                countryCode: countryCode.toUpperCase()
            }).lean();
            const favoriteUUIDs = new Set(userMarkers.map(m => m.stationuuid));

            // Convert, then marks favourites
            const formatted = stations.map(station => ({
                stationuuid: station.stationuuid,
                name: station.name,
                tags: station.tags ? station.tags.split(',').map(t => t.trim()) : [],
                url_resolved: station.url_resolved,
                state: station.state,
                countryCode: countryCode.toUpperCase(),
                favorite: favoriteUUIDs.has(station.stationuuid)
            }));

            res.status(200).json(formatted);

        } catch (error) {
            res.status(500).json({ title: 'Server error', error: error.message });
        }
    }