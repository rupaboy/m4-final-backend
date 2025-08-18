import CountryRepository from "../repositories/countryRepository.mjs";

//CREATE
export async function createAllCountries(processedCountries) {
    return await CountryRepository.createAll(processedCountries)
}

export async function createCountry(processedCountry) {
    return await CountryRepository.createOne(processedCountry)
}

//READ
export async function readAllCountries() {
    return await CountryRepository.readAll()
}

export async function readCountryById(id) {
    return await CountryRepository.readById(id)
}

export async function readCountryByCode(code) {
    return await CountryRepository.readByCode(code)
}

export async function readCountryDuplicates() {
    return await CountryRepository.readDuplicates()
}

//UPDATE
export async function updateCountryByCode(code, processedCountry) {
    return await CountryRepository.updateByCode(code, processedCountry)
}

//DELETE
export async function deleteCountryById(id) {
    return await CountryRepository.deleteById(id)
}

export async function deleteAllCountries() {
    return await CountryRepository.deleteAll()
}