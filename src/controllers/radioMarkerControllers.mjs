import RadioMarker from "../models/radioMarkerModel.mjs";
import {
    createRadioMarker,
    readAllMarkersByUser,
    readAllMarkersByCountry,
    searchMarkersByName,
    readMarkerById,
    updateMarkerStatus,
    updateMarkerScore,
    deleteMarkerById,
    deleteAllMarkersByUser,
    readFavoriteCountries,
    radioBrowserAPI,
} from "../services/radioMarkerService.mjs";

// CREATE
export async function createRadioMarkerController(req, res) {
    try {
        const { stationuuid, name, tags, url_resolved, state, countryCode } = req.body;

        // Check authentication
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = req.user.id;

        // already marked (user + stationuuid)
        const existingMarker = await RadioMarker.findOne({ user: userId, stationuuid });
        if (existingMarker) {
            return res.status(400).json({ message: "Stations was already marked" });
        }

        const newMarker = {
            user: userId,
            stationuuid,
            name,
            tags: SanitizeTags(tags),
            url_resolved,
            state,
            countryCode
        };

        const marker = await createRadioMarker(newMarker);

        return res.status(201).json({ message: "Radio marker created successfully", marker });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}


// READ
// FAVORITES
export async function readFavoriteCountriesController(req, res) {
    try {
        const { id } = req.params;
        const countries = await readFavoriteCountries(id);
        console.log(id, countries)
        if (!countries.length) return res.status(404).json({ message: "No favorite countries found for user" });
        return res.status(200).json(countries);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function browseRadiosByCountryCode(req, res) {
    try {
        const RADIO_PAGE_LIMIT = parseInt(process.env.RADIO_PAGE_LIMIT, 10);
        const { code, page } = req.params;
        const currentPage = parseInt(page) || 1;
        const offset = (currentPage - 1) * RADIO_PAGE_LIMIT;

        // Fetch stations paginated
        const { data: stations } = await radioBrowserAPI.get(
            `/stations/bycountrycodeexact/${code.toLowerCase()}`,
            { params: { offset, limit: RADIO_PAGE_LIMIT } } // sin order
        );

        if (!stations || stations.length === 0) {
            return res.status(404).json({ message: 'No stations found for this country.' });
        }

        // Fetch user's marked stations
        const userMarkers = await RadioMarker.find({
            user: req.user,
            countryCode: code.toUpperCase()
        }).lean();
        const favoriteUUIDs = new Set(userMarkers.map(m => m.stationuuid));

        // Format stations
        const formatted = stations.map(station => ({
            stationuuid: station.stationuuid,
            name: station.name.trim(),
            tags: station.tags ? station.tags.split(',').map(t => t.trim()) : [],
            url_resolved: station.url_resolved,
            state: station.state,
            countryCode: code.toUpperCase(),
            favorite: favoriteUUIDs.has(station.stationuuid)
        }));

        // Determine next/previous page
        const previousPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = stations.length === RADIO_PAGE_LIMIT ? currentPage + 1 : null;

        res.status(200).json({
            page: currentPage,
            previousPage,
            nextPage,
            results: formatted
        });
    } catch (error) {
        res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function readAllMarkersByUserController(req, res) {
    try {
        const markers = await readAllMarkersByUser(req.params.id);
        if (!markers.length) return res.status(404).json({ message: "No markers found for user" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function readAllMarkersByCountryController(req, res) {
    try {
        const { id, code } = req.params
        const countryCode = code.toUpperCase()
        const markers = await readAllMarkersByCountry(id, countryCode);
        if (!markers.length) return res.status(404).json({ message: "No markers found for this country" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

export async function searchMarkersByNameController(req, res) {
    try {
        const { id, name } = req.params
        const markers = await searchMarkersByName(id, name);
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
export async function updateMarkerStatusController(req, res) {
    try {
        const { id } = req.params;
        const updated = await updateMarkerStatus(id);

        if (!updated) {
            return res.status(404).json({ message: `No se pudo actualizar el marcador con id ${id}` });
        }
        return res.status(200).json({
            message: `Marcador ${updated.name} actualizado correctamente`,
            marker: updated
        });
    } catch (error) {
        return res.status(500).json({ title: "Error del servidor", error: error.message });
    }
}


export async function updateMarkerScoreController(req, res) {
    try {
        const userId = req.user?.id; //req.user from middleware
        if (!userId) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }
        const { id, score } = req.params;

        // Find marker and validate user
        const marker = await RadioMarker.findOne({ _id: id, user: userId });
        if (!marker) {
            return res.status(404).json({ message: `Marker id ${id} not found` });
        }

        // Update score
        await updateMarkerScore(id, score);

        return res.status(200).json({ message: "Station score updated!", marker });
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
        await deleteAllMarkersByUser(req.params.id);
        return res.status(200).json({ message: "All markers for user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: "Server error", error: error.message });
    }
}

