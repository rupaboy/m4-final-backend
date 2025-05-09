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
    async post(newCountry) {
        
        const gini = {};
        if (newCountry.countryGiniYearLatest && newCountry.countryGiniValueLatest) {
            gini[newCountry.countryGiniYearLatest] = newCountry.countryGiniValueLatest
        }

        const country = new Country(
            {
                flags: {
                    svg: newCountry.countryFlag
                },
                name: {
                    common: newCountry.countryName,
                    official: newCountry.countryName,
                    nativeName: {
                        spa: {
                            common: newCountry.countryName
                        }
                    }
                },
                capital: newCountry.countryCapitals,
                continents: newCountry.countryContinents,
                region: newCountry.countryRegion,
                subregion: newCountry.countrySubRegion,
                borders: newCountry.countryBorders,
                latlng: newCountry.countryLatLong,
                area: newCountry.countryArea,
                population: newCountry.countryPopulation,
                languages: newCountry.countryLanguages,
                currencies: newCountry.countryCurrencies,
                gini: gini,
                timezones: newCountry.countryTimezones
            })
            //console.log(country)
            return await country.save()
        }

//PUT
    async editById(id, updatedCountry) {

        const gini = {};
        if (updatedCountry.countryGiniYearLatest && updatedCountry.countryGiniValueLatest) {
            gini[updatedCountry.countryGiniYearLatest] = updatedCountry.countryGiniValueLatest
        }

        const newCountry = await Country.findByIdAndUpdate(
            id,
            { $set: {
                "flags.svg": updatedCountry.countryFlag,
                "name.common": updatedCountry.countryName,
                "name.official": updatedCountry.countryName,
                "name.nativeName.spa.common": updatedCountry.countryName,
                "capital": updatedCountry.countryCapitals,
                "continents": updatedCountry.countryContinents,
                "region": updatedCountry.countryRegion,
                "subregion": updatedCountry.countrySubRegion,
                "borders": updatedCountry.countryBorders,
                "latlng": updatedCountry.countryLatLong,
                "area": updatedCountry.countryArea,
                "population": updatedCountry.countryPopulation,
                "languages": updatedCountry.countryLanguages,
                "currencies": updatedCountry.countryCurrencies,
                "gini": gini,
                "timezones": updatedCountry.countryTimezones
            }},
            { new: true, lean: true}
        )
        return newCountry
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