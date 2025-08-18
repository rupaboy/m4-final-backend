import RadioMarker from "../models/radioMarkerModel.mjs";
import IRepository from "./IRepository.mjs";

class RadioMarkerRepository extends IRepository {
    async readAllByUser(userId) {
        return await RadioMarker.find({ user: userId })
            .populate("radio")
            .lean();
    }

    async readById(id) {
        return await RadioMarker.findById(id).populate("radio").lean();
    }

    async createNew(markerData) {
        const newMarker = new RadioMarker(markerData);
        return await newMarker.save();
    }

    async updateScore(markerId, score) {
        return await RadioMarker.findByIdAndUpdate(
            markerId,
            { $set: { score } },
            { new: true }
        ).populate("radio").lean();
    }

    async deleteById(id) {
        return await RadioMarker.findByIdAndDelete(id).lean();
    }

    async deleteAllByUser(userId) {
        return await RadioMarker.deleteMany({ user: userId });
    }
}
export default new RadioMarkerRepository();
