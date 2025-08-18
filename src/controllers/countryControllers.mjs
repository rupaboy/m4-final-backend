import { apiRestCountriesConsumer } from '../helpers/apiRestCountriesConsumer.mjs'
import { apiRestCountryConsumer } from '../helpers/apiRestCountryConsumer.mjs'

import {
    createAllCountries,
    createCountry,
    readAllCountries,
    readCountryById,
    readCountryByCode,
    readCountryDuplicates,
    updateCountryByCode,
    deleteCountryById,
    deleteAllCountries,
} from '../services/countryServices.mjs'


//CREATE
export async function createAllCountriesController(req, res) {
    try {
        const success = await deleteAllCountries();
        if (!success) {
            return res.status(400).json({
                message: "Couldn't drop countries collection"
            });
        }
        //Deletes collection and attemps to restore it from the source API
        const countries = await apiRestCountriesConsumer();
        if (!countries || countries.length === 0) {
            return res.status(400).json({
                message: `${countries.length} countries found`
            });
        }

        //Data Structuring
        const processedCountries = countries
            .filter(country =>
                Array.isArray(country.continents) &&
                !(country.continents.length === 1 && country.continents[0] === 'Antarctica')
            )
            .map(country => ({
                code: country.cca2,
                name: country.name.common,
                area: country.area,
                population: country.population,
                continents: country.continents.filter(c => c !== "Antarctica"),
                flag: country.flags.svg,
                languages: country.languages
                    ? Object.values(country.languages).filter(l => !l.includes('Sign Language'))
                    : [],
                capitals: country.capital || ["N/A"],
                timezones: country.timezones,
                latlng: country.latlng,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        const insertedCountries = await createAllCountries(processedCountries);

        res.status(200).json({
            message: `${insertedCountries.length} countries added to collection.`
        });
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

export async function createCountryController(req, res) {
    const { code } = req.params;

    const sanitizedCode = code.trim(' ').toUpperCase()

    try {
        // Bring a single country
        const country = await apiRestCountryConsumer(sanitizedCode);
        if (!country) {
            return res.status(404).json({
                message: `No country found with code ${sanitizedCode}`
            });
        };
        // Data Structuring
        const processedCountry = {
            code: country.cca2,
            name: country.name.common,
            area: country.area,
            population: country.population,
            continents: country.continents.filter(c => c !== "Antarctica"),
            flag: country.flags.svg,
            languages: country.languages
                ? Object.values(country.languages).filter(l => !l.includes('Sign Language'))
                : [],
            capitals: country.capital || ["N/A"],
            timezones: country.timezones,
            latlng: country.latlng,
        };
        // Inserts country in DataBase
        const insertedCountry = await createCountry(processedCountry);

        if (insertedCountry === null) {
            return res.status(400).json({
                message: `No country with code ${sanitizedCode} found`
            }
            )
        }
        res.status(200).json({
            message: `Country ${processedCountry.name} added to collection.`
        });
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

//READ
export async function readAllCountriesController(req, res) {

    try {
        const countries = await readAllCountries()
        if (!countries.length) {
            return res.status(400).json({
                message: `No countries found`
            })
        }
        res.status(200).json(countries);

    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

export async function readCountryByIdController(req, res) {

    const { id } = req.params
    try {
        const country = await readCountryById(id)
        if (country === null) {
            return res.status(400).json({
                message: `No country with id ${id} found`
            })
        }
        res.status(200).json(country);

    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

export async function readCountryByCodeController(req, res) {

    const { code } = req.params
    try {
        const country = await readCountryByCode(code)

        if (country === null) {
            return res.status(400).json({
                message: `No country with code ${code} found`
            })
        }
        res.status(200).json(country);

    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

export async function readCountryDuplicatesController(req, res) {
    try {
        const countries = await readCountryDuplicates()

        if (countries === null) {
            return res.status(400).json({
                message: `No country duplicates found`
            })
        }
        res.status(200).json(countries);

    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
}

//UPDATE
export async function updateCountryByCodeController(req, res) {
    const { code } = req.params;
    const sanitizedCode = code.toUpperCase().trim()
    const country = await readCountryByCode(sanitizedCode)

    if (country === null) {
        return res.status(400).json({
            message: `No country with code ${sanitizedCode} found`
        })
    }

    try {
        // Bring a single country
        const country = await apiRestCountryConsumer(sanitizedCode);
        if (country === null) {
            return res.status(404).json({
                message: `No country found with code ${sanitizedCode}`
            });
        };
        // Data Structuring
        const processedCountry = {
            name: country.name.common,
            area: country.area,
            population: country.population,
            continents: country.continents.filter(c => c !== "Antarctica"),
            flag: country.flags.svg,
            languages: country.languages
                ? Object.values(country.languages).filter(l => !l.includes('Sign Language'))
                : [],
            capitals: country.capital || ["N/A"],
            timezones: country.timezones,
            latlng: country.latlng,
        };
        // Inserts country in DataBase
        const insertedCountry = await updateCountryByCode(sanitizedCode, processedCountry);

        res.status(200).json({
            message: `Country ${insertedCountry.name} updated in collection.`
        });
    } catch (error) {
        res.status(500).json({
            title: 'Server data error',
            error: error.message
        });
    };
};

//DELETE

export async function deleteCountryByIdController(req, res) {
    const { id } = req.params
    try {
        const country = await readCountryById(id)
        if (!country) {
            return res.status(400).json({
                message: "Couldn't find country", id
            });
        };

        const success = await deleteCountryById(id)
        if (success) {
            return res.status(200).json({
                message: `Success deleting ${id}`
            });
        };
    } catch (error) {
        return res.status(500).json({
            title: 'Server error',
            error: error.message
        });
    };
};

export async function deleteAllCountriesController(req, res) {
    try {
        const success = await deleteAllCountries()
        if (!success) {
            return res.status(400).json({
                message: "Couldn't drop countries collection"
            });
        }
        return res.status(200).json({
            message: "Countries collection dropped successfully"
        });

    } catch (error) {
        console.error("Error purging countries", error);
        return res.status(500).json({
            title: 'Server Error',
            error: error.message
        });
    }
}