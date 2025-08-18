import {
    createRadio,
    readAllRadios,
    readRadioById,
    readRadiosByCountry,
    updateRadioById,
    deleteRadioById,
    deleteAllRadios
} from "../services/radioService.mjs";

// CREATE
export async function createRadioController(req, res) {
    try {
        const radioData = req.body;
        const created = await createRadio(radioData);
        return res.status(201).json({ message: `Radio "${created.name}" created successfully`, radio: created });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// READ
export async function readAllRadiosController(req, res) {
    try {
        const radios = await readAllRadios();
        if (!radios.length) return res.status(400).json({ message: 'No radios found' });
        return res.status(200).json(radios);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function readRadioByIdController(req, res) {
    try {
        const radio = await readRadioById(req.params.id);
        if (!radio) return res.status(400).json({ message: `No radio with id ${req.params.id} found` });
        return res.status(200).json(radio);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function readRadiosByCountryController(req, res) {
    try {
        const radios = await readRadiosByCountry(req.params.code);
        if (!radios.length) return res.status(400).json({ message: `No radios found for country ${req.params.code}` });
        return res.status(200).json(radios);
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// UPDATE
export async function updateRadioByIdController(req, res) {
    try {
        const updated = await updateRadioById(req.params.id, req.body);
        if (!updated) return res.status(400).json({ message: `Radio with id ${req.params.id} not found` });
        return res.status(200).json({ message: `Radio updated successfully`, radio: updated });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

// DELETE
export async function deleteRadioByIdController(req, res) {
    try {
        const deleted = await deleteRadioById(req.params.id);
        if (!deleted) return res.status(400).json({ message: `Radio with id ${req.params.id} not found` });
        return res.status(200).json({ message: `Radio deleted successfully` });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}

export async function deleteAllRadiosController(req, res) {
    try {
        await deleteAllRadios();
        return res.status(200).json({ message: "All radios deleted successfully" });
    } catch (error) {
        return res.status(500).json({ title: 'Server error', error: error.message });
    }
}
