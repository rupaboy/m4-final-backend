import RadioMarker from "../models/radioMarkerModel.mjs";
import IRepository from "./IRepository.mjs";

class RadioMarkerRepository extends IRepository {
    // All radios of user Id
    async readAllByUser(userId) {
        return await RadioMarker.find({ user: userId }).lean();
    }

    // All radio markers by country code
    async readAllByCountry(userId, countryCode) {
        return await RadioMarker.find({ user: userId, countryCode }).lean();
    }

    // Radio marker name Regex search
    async searchByName(userId, query) {
        return await RadioMarker.find({
            user: userId,
            name: { $regex: query, $options: "i" }
        }).lean();
    }

    // Read radio marker by id
    async readById(id) {
        return await RadioMarker.findById(id).lean();
    }

    // New radioMarker
    async createNew(markerData) {
        const newMarker = new RadioMarker(markerData);
        return await newMarker.save();
    }

    // Update radioMarker score
    async updateScore(markerId, score) {
        return await RadioMarker.findByIdAndUpdate(
            markerId,
            { $set: { score } },
            { new: true }
        ).lean();
    }

    // Delete radioMarker by Id
    async deleteById(id) {
        return await RadioMarker.findByIdAndDelete(id).lean();
    }

    // Delete all radio markers by user Id
    async deleteAllByUser(userId) {
        return await RadioMarker.deleteMany({ user: userId });
    }

    // Add a Tag if not existant
    async createTag(markerId, newTag) {
        return await RadioMarker.findByIdAndUpdate(
            markerId,
            { $addToSet: { tags: newTag.trim() } },
            { new: true }
        ).lean();
    }

    // Delete a tag
    async deleteTag(markerId, tagToRemove) {
        return await RadioMarker.findByIdAndUpdate(
            markerId,
            { $pull: { tags: tagToRemove.trim() } },
            { new: true }
        ).lean();
    }

    // Replace tag
    async updateTag(markerId, oldTag, newTag) {
        return await RadioMarker.findOneAndUpdate(
            { _id: markerId, tags: oldTag },
            { $set: { "tags.$": newTag.trim() } },
            { new: true }
        ).lean();
    }

    // Replace all tags
    async updateTags(markerId, tagsArray) {
        return await RadioMarker.findByIdAndUpdate(
            markerId,
            { tags: tagsArray.map(t => t.trim()) },
            { new: true }
        ).lean();
    }

    // Get favorite countries for a user with count of radios
    async readFavoriteCountries(userId) {
        return await RadioMarker.aggregate([
            { $match: { user: userId } },
            { $group: { _id: "$countryCode", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
    }
}

export default new RadioMarkerRepository();
