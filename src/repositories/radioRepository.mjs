import Radio from "../models/radioModel.mjs";
import IRepository from "./IRepository.mjs";

class RadioRepository extends IRepository {
    async readAll() {
        return await Radio.find().sort({ name: 1 }).lean();
    }

    async readById(id) {
        return await Radio.findById(id).lean();
    }

    async readByCountry(code) {
        return await Radio.find({ countryCode: code.toUpperCase() }).sort({ name: 1 }).lean();
    }

    async createNew(radioData) {
        const newRadio = new Radio(radioData);
        return await newRadio.save();
    }

    async updateById(id, updateData) {
        return await Radio.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();
    }

    async deleteById(id) {
        return await Radio.findByIdAndDelete(id).lean();
    }

    async deleteAll() {
        await Radio.deleteMany({});
        return true;
    }
}
export default new RadioRepository();