import { filterCountries, sanitizeCountryObject } from '../validators/countriesSanitizers.mjs'
import { getCapitalImage } from '../helpers/apiWikipediaCapitalImageConsumer.mjs'
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
        const processedCountries = filterCountries(countries)
            .map(country => sanitizeCountryObject(country))
            .filter(Boolean) //removes null
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
    const sanitizedCode = code.trim(' ').toUpperCase();
    try {
        // Bring a single country
        const countryRaw = await apiRestCountryConsumer(sanitizedCode);
        if (!countryRaw) {
            return res.status(404).json({
                message: `No country found with code ${sanitizedCode}`
            });
        };
        // Data Structuring
        const processedCountry = sanitizerCountryObject(countryRaw);

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
};

export async function readCountryCapitalImage(req, res) {
  const { name } = req.params;
  const sanitizedName = name.trim();
  const capitalizedName = sanitizedName
    .charAt(0).toUpperCase() + sanitizedName.slice(1).toLowerCase();
  try {
    const capitalImage = await getCapitalImage(capitalizedName);
    if (!capitalImage) {
      return res.status(404).json({
        message: `No capital image found for ${capitalizedName}`
      });
    }
    res.status(200).json({
      message: `Found an image for ${capitalizedName}!`,
      imageUrl: capitalImage
    });
  } catch (error) {
    res.status(500).json({
      title: "Server data error",
      error: error.message
    });
  }
}

//UPDATE
export async function updateCountryByCodeController(req, res) {
    const { code } = req.params;
    const sanitizedCode = code.toUpperCase().trim()
    //Exists?
    const existingCountry = await readCountryByCode(sanitizedCode);
    if (!existingCountry) {
        return res.status(400).json({
            message: `No country with code ${sanitizedCode} found`
        });
    }
    try {
        // Bring a single country
        const countryRaw = await apiRestCountryConsumer(sanitizedCode);
        if (!countryRaw) {
            return res.status(404).json({
                message: `No country found with code ${sanitizedCode}`
            });
        };
        // Data Structuring
        const processedCountry = sanitizeCountryObject(countryRaw)
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