import Country from "../models/countryModel.mjs";
import IRepository from '../repositories/IRepository.mjs';
import { Types } from 'mongoose';

class CountryRepository extends IRepository {

//GET
    async getAll() {
        return await Country.find({ startOfWeek: {$exists: true}, creator: 'Fernando Pais' })
         .sort({
            //Si no consigue ordenar alfabeticamente con nativo común, usa nombre común (inglés)
            'name.nativeName.spa.common': 1,
            'name.common': 1,
        })
        .lean() //Convierte a objeto javascript
    }

    async getById(id) {
        const objectId = Types.ObjectId.createFromHexString(id)
        return await Country.findById(objectId).lean()
        
    }
    
//POST
    async post(
        countryData
        ) { const country = new Country(
            {
                creador: countryData
            })
            //console.log(country)
            return await country.save();
        }

//PUT
    async editById(id, updatedCountry) {

        const oldCountry = await Country.findById(id);
        const newCountry = {}

        for (let atributo in updatedCountry) {
            if (updatedCountry[atributo] !== oldCountry[atributo]) {
                newCountry[atributo] = updatedCountry[atributo]
            }
        } //Bucle for ...in - atributo tomará el nombre de cada clave. 

        return await Country.findOneAndUpdate(
            { _id: id },
            { $set: newCountry},
            { returnDocument: 'after' }
        )
    };

//DELETE
    async removeById(id) {
        return await Country.findByIdAndDelete(id)
    }

    async removeAll() {
        return await Country.deleteMany({ status: 'officially-assigned', creator: 'Fernando Pais' })
    }



};

export default new CountryRepository();