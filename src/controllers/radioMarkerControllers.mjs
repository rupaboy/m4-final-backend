import {
    createRadioMarker,
    readAllMarkersByUser,
    readMarkerById,
    updateMarkerScore,
    deleteMarkerById,
    deleteAllMarkersByUser
} from "../services/radioMarkerService.mjs";

// CREATE
export async function createRadioMarkerController(req, res) {
    try {
        const marker = await createRadioMarker(req.body);
        return res.status(201).json({ message: "Radio marker created successfully", marker });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// READ
export async function readAllMarkersByUserController(req, res) {
    try {
        const markers = await readAllMarkersByUser(req.params.userId);
        if (!markers.length) return res.status(400).json({ message: "No markers found for user" });
        return res.status(200).json(markers);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function readMarkerByIdController(req, res) {
    try {
        const marker = await readMarkerById(req.params.id);
        if (!marker) return res.status(400).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json(marker);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// UPDATE
export async function updateMarkerScoreController(req, res) {
    try {
        const updated = await updateMarkerScore(req.params.id, req.body.score);
        if (!updated) return res.status(400).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json({ message: "Marker score updated successfully", marker: updated });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// DELETE
export async function deleteMarkerByIdController(req, res) {
    try {
        const deleted = await deleteMarkerById(req.params.id);
        if (!deleted) return res.status(400).json({ message: `Marker with id ${req.params.id} not found` });
        return res.status(200).json({ message: "Marker deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function deleteAllMarkersByUserController(req, res) {
    try {
        await deleteAllMarkersByUser(req.params.userId);
        return res.status(200).json({ message: "All markers for user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}
