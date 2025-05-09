import CountryRepository from "../repositories/countryRepository.mjs";

//GET
export async function getAllCountries() {
    return await CountryRepository.getAll()
}

export async function getCountryById(id){
    return await CountryRepository.getById(id)
}

//POST
export async function postCountry(newCountry) {
    return await CountryRepository.post(newCountry)
}

// PUT
export async function editCountryById(id, updatedCountry) {
    return await CountryRepository.editById(id, updatedCountry);
}

//DELETE
export async function removeCountryById(id) {
    return await CountryRepository.removeById(id); 
}


export async function removeAllCountries() {
    return await CountryRepository.removeAll()
}
