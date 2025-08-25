import Country from "../models/countryModel.mjs";
import IRepository from '../repositories/IRepository.mjs';

class CountryRepository extends IRepository {

    //CREATE
    async createAll(processedCountries) {
        await Country.bulkWrite(
            processedCountries.map(country => ({
                updateOne: {
                    filter: { code: country.code },
                    update: { $set: country },
                    upsert: true
                }
            }))
        );
        return await Country.find()
            .sort({ 'name': 1 });
    }

    async createOne(processedCountry) {
        await Country.create(processedCountry);
    }

    //READ
    async readAll() {
        return await Country.find()
            .sort({
                'name': 1,
            }).lean(); //TO JS Object
    }

    async readById(id) {
        return await Country.findById(id);
    }

    async readByCode(code) {
        const upperCaseCode = code.toUpperCase()
        return await Country.findOne(
            { code: upperCaseCode }
        ).lean();
    }

    async readDuplicates() {
        const duplicates = await Country.aggregate([
            {
                $group: {
                    _id: "$code",          // Group By code
                    count: { $sum: 1 },
                    docs: { $push: "$$ROOT" } // Get full Documents
                }
            },
            {
                $match: { count: { $gt: 1 } } // Existing above 1 time
            },
            {
                $project: {                 // Won't return id or count, only Documents
                    _id: 0,
                    docs: 1
                }
            }
        ]);
        // Flatten array of Documents
        return duplicates.flatMap(group => group.docs);
    }

    //UPDATE
    async updateByCode(code, processedCountry) {
        const updateDoc = {
            $set: {
                name: processedCountry.name,
                area: processedCountry.area,
                population: processedCountry.population,
                flag: processedCountry.flag,
                languages: processedCountry.languages,
                continents: processedCountry.continents,
                capitals: processedCountry.capitals,
                borders: processedCountry.borders,
                timezones: processedCountry.timezones
            }
        };

        //Insertion
        const country = await Country.findOneAndUpdate(
            { code },
            updateDoc,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );
        return country;
    }

    //DELETE
    async deleteById(id) {
        return await Country.findOneAndDelete({
            _id: id
        });
    }

    async deleteAll() {
        const exists = await Country.db.listCollections({ name: 'countries' })
        if (!exists) return false;
        await Country.collection.drop();
        return true;
    }
};

export default new CountryRepository();