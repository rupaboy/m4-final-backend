import RadioMarker from "../models/radioMarkerModel.mjs";
import { radioBrowserAPI } from "../services/radioMarkerService.mjs";
import IRepository from "./IRepository.mjs";
import mongoose from "mongoose"

class RadioMarkerRepository extends IRepository {

    // CREATE radioMarker
    async createNew(markerData) {
        const newMarker = new RadioMarker(markerData);
        return await newMarker.save();
    }

    // Get favorite countries for a user with count of radios
    async readFavoriteCountries(id) {
        return await RadioMarker.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(`${id}`) } },
            { $group: { _id: "$countryCode", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    countryCode: "$_id",
                    count: 1
                }
            },
            {
                $lookup: {
                    from: "countries",          // countries collection
                    localField: "countryCode",
                    foreignField: "code",       // Country code
                    as: "country"
                }
            },
            { $unwind: "$country" } // From array to Obj
        ]);
    }

    // All radios of user Id
    async readAllByUser(userId) {
        return await RadioMarker.find({ user: userId }).lean();
    }

    // All radio markers by country code
    async readAllByCountry(id, code) {
        const user = new mongoose.Types.ObjectId(`${id}`)
        return await RadioMarker.find({ user: user, countryCode: code }).lean();
    }

    // Radio marker name Regex search
    async searchByName(id, name) {
        return await RadioMarker.find({
            user: id,
            name: { $regex: name, $options: "i" }
        }).lean();
    }

    // Read radio marker by id
    async readById(id) {
        return await RadioMarker.findById(id).lean();
    }

    // UPDATE radioMarker status
    async updateStatus(id) {

        // Buscar marcador por _id y usuario
        const marker = await RadioMarker.findById(id);
        if (!marker) return null;

        const stationuuid = marker.stationuuid;
        // Consultar API externa
        const response = await radioBrowserAPI.get(`/stations/byuuid/${stationuuid}`);
        if (!response.data || response.data.length === 0) return null;
        const apiStation = response.data[0];

        // Normalizar datos
        const processedMarker = {
            name: apiStation.name,
            tags: apiStation.tags ? apiStation.tags.split(',').map(t => t.trim()) : [],
            url_resolved: apiStation.url_resolved,
            state: apiStation.state,
            countryCode: apiStation.countrycode // ojo: en la API es "countrycode" (minúscula)
        };
        // Actualizar documento en Mongo
        const updatedMarker = await RadioMarker.findOneAndUpdate(
            { _id: id },
            { $set: processedMarker },
            { new: true }
        );
        return updatedMarker;
    }



    // Update radioMarker score
    async updateScore(id, score) {
        const userId = new mongoose.Types.ObjectId(`${id}`)
        return await RadioMarker.findByIdAndUpdate(
            userId,
            { $set: { score } },
            { new: true }
        ).lean();
    }

    // Delete radioMarker by Id
    async deleteById(id) {
        return await RadioMarker.findByIdAndDelete(id).lean();
    }

    // Delete all radio markers by user Id
    async deleteAllByUser(id) {
        return await RadioMarker.deleteMany({ user: id });
    }


}

export default new RadioMarkerRepository();
