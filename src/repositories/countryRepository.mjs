import Country from "../models/countryModel.mjs";
import IRepository from '../repositories/IRepository.mjs';

class CountryRepository extends IRepository {

//GET
    async getAll() {
        return await Country.find({ status: 'officially-assigned', creator: 'Fernando Pais' })
         .sort({
            //Si no consigue ordenar alfabeticamente con nativo común, usa nombre común (inglés)
            'name.nativeName.spa.common': 1,
            'name.common': 1,
        })
    }

    async getById(id) {;  //OK
        return await Country.findById(id)
    }

/*
    async removeAll() {
        return await country.deleteMany({ status: 'officially-assigned', creator: 'Fernando Pais' })
    }

*/

};

export default new CountryRepository();