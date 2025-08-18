import {
    createCountryMarker,
    readAllCountryMarkersByUser,
    readCountryMarkerByUserAndCode,
    deleteCountryMarkerById,
    deleteAllCountryMarkersByUser
} from "../services/countryMarkerService.mjs";

// CREATE
export async function createCountryMarkerController(req, res) {
    try {
        const marker = await createCountryMarker(req.body);
        return res.status(201).json({ message: "Country marker created successfully", marker });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// READ
export async function readAllCountryMarkersByUserController(req, res) {
    try {
        const markers = await readAllCountryMarkersByUser(req.params.userId);
        if (!markers.length) return res.status(400).json({ message: "No country markers found for user" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function readCountryMarkerByUserAndCodeController(req, res) {
    try {
        const marker = await readCountryMarkerByUserAndCode(req.params.userId, req.params.code);
        if (!marker) return res.status(400).json({ message: `No country marker found for user and country ${req.params.code}` });
        return res.status(200).json(marker);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// DELETE
export async function deleteCountryMarkerByIdController(req, res) {
    try {
        const deleted = await deleteCountryMarkerById(req.params.id);
        if (!deleted) return res.status(400).json({ message: `Country marker with id ${req.params.id} not found` });
        return res.status(200).json({ message: "Country marker deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function deleteAllCountryMarkersByUserController(req, res) {
    try {
        await deleteAllCountryMarkersByUser(req.params.userId);
        return res.status(200).json({ message: "All country markers for user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}