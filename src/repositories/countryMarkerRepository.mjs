import CountryMarker from "../models/countryMarkerModel.mjs";
import IRepository from "./IRepository.mjs";

class CountryMarkerRepository extends IRepository {
    async readAllByUser(userId) {
        return await CountryMarker.find({ user: userId }).lean();
    }

    async readByCountryAndUser(userId, code) {
        return await CountryMarker.findOne({
            user: userId,
            code: code.toUpperCase()
        }).lean();
    }

    async createNew(markerData) {
        const newMarker = new CountryMarker(markerData);
        return await newMarker.save();
    }

    async deleteById(id) {
        return await CountryMarker.findByIdAndDelete(id).lean();
    }

    async deleteAllByUser(userId) {
        return await CountryMarker.deleteMany({ user: userId });
    }
}
export default new CountryMarkerRepository();