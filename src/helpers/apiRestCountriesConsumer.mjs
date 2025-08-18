import axios from "axios";

export const apiRestCountriesConsumer = async () => {
    try {
        const response = await axios.get(
            'https://restcountries.com/v3.1/all',
            { params: {
                fields:
                'continents,languages,timezones,cca2,name,flags,capital,population,area,latlng'
                }
            });

        const countries = response.data;

        return countries;

    } catch (error) {
        console.error("Error en la solicitud a RestCountries:", error.message);
        throw error;
    }
};


