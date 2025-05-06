import Country from "../models/countryModel.mjs";


export const apiRestConsumer = async () => {
    try {
        console.log('Rest Countries consumer initialized')
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Error en la solicitud a RestCountries')
        }
    //Requerimos el array de países
        const countries = JSON.parse(JSON.stringify( await response.json() ))
        
        //Filtramos
        const spanishSpeakingCountries = countries.filter(country => 
                
            //Devolveré si existe la propiedad languages y si existe languages.spa
            country.languages && country.languages.spa );
            
            //Recorremos el array de países
            spanishSpeakingCountries.forEach(country => {

                    //Eliminar propiedades
                    delete country.translations;
                    delete country.tld;
                    delete country.cca2;
                    delete country.ccn3;
                    delete country.cca3;
                    delete country.cioc;
                    delete country.idd;
                    delete country.altSpellings;
                    delete country.car;
                    delete country.coatOfArms;
                    delete country.postalCode;
                    delete country.demonyms;

                        //Agregar propiedad creator
                    country.creator = 'Fernando Pais';

            });

            try {
                //Subir a MongoDB

                console.log(spanishSpeakingCountries)
                const result = await Country.insertMany(spanishSpeakingCountries)
                console.log('Datos subidos satisfactoriamente', result)
            }
            catch (err) {
                console.log('Error al intentar subir los datos', err);
            }

    } catch (error) {
        console.log('Hubo un problema con la solitud fetch:', error)
    }

};

