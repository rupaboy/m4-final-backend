import axios from "axios";

export const apiRestCountriesConsumer = async () => {
    try {
        const response = await axios.get(
            'https://restcountries.com/v3.1/all',
            { params: {
                fields:
                'continents,languages,timezones,cca2,name,flags,capital,borders,population,area'
                }
            });

        const countries = response.data;

        return countries;

    } catch (error) {
        console.error("Error fetching Rest Countries:", error.message);
        throw error;
    }
};


