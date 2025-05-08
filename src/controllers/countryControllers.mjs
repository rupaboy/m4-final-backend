import {
    getAllCountries,
    getCountryById,
    postCountry,
    editCountryById,
    removeCountryById,
    removeAllCountries,
} from '../services/countryServices.mjs';


//GET
export async function getAllCountriesController(req, res) {
    
    try {
        const countries = await getAllCountries();

        // Inicializamos numero de países listados, area de extensión total y población total
        const listedCountriesNumber = countries.length;
        let countriesTotalArea = 0
        let countriesTotalPopulation = 0

        // Inicializamos números de países con índice Gini, y variable destinada al Gini promedio
        let countriesWithGini = 0
        let countriesGiniAverage = 0
        
        //Por cada país...
        countries.forEach((country)=>{
            countriesTotalArea += country.area //...sumamos su área de extensión
            countriesTotalPopulation += country.population //...sumamos su población

            if (country.gini) { //Si existe el índice gini en ese país...
                ++countriesWithGini //Incrementamos el número de países con índice Gini

                const lastGini = country.gini[Object.keys(country.gini)[Object.keys(country.gini).length - 1]]
                //Utilizando el último índice registrado en el array, y lo sumamos al total de Gini.
                countriesGiniAverage += lastGini
            }
        })
            //Obtenemos el promedio (índice total / países indizados)
            countriesGiniAverage /= countriesWithGini


        res.status(200).render('dashboard', {
            title: `Dashboard - ${listedCountriesNumber} items`,
            countries,
            listedCountriesNumber,
            countriesTotalArea,
            countriesTotalPopulation,
            countriesWithGini,
            countriesGiniAverage
        }) //Pasamos las variables al render 'Dashboard'
        
    } catch (error) {
        res.status(500).send('500', error)
    }
}


export async function getCountryByIdController(req, res) {
        
    const { id } = req.params

    try {

        const country = await getCountryById(id);

        if (!country) {
            return res.status(404).render('404', {
                title: 'Not found'
            })
        }
        res.status(200).render('result', {
            title: `Result: ${country.name.nativeName.spa.common}`,
            country
        }
            
        );
    } catch (error) {
        res.status(500).send('500', {error})
        
    }
}


export async function addNewCountryController(req, res) {
        res.render('addCountry', {title: 'Agregar un país'})
    
}

export async function editCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);

    res.render('editCountry', { title: `Editar ${country.name.nativeName.spa.common}`, country } )
}

export async function removeCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);
    
    res.render('removeCountry', { title: `Borrar ${country.name.nativeName.spa.common}`, country } )
}


//POST
export async function postCountryController(req, res) {
    try {

        if (req.body.countryFlag === '') {
            delete req.body.countryFlag
        } //Si req.body.countryFlag es una string vacía, lo elimina.

        const {
            countryFlag,
            countryName,
            countryCapitals,
            countryContinents,
            countryRegion,
            countrySubRegion,
            countryBorders,
            countryLatLong,
            countryArea,
            countryPopulation,
            countryLanguages,
            countryCurrencies,
            countryTimezones
        } = req.body

        const objectCurrencies = countryCurrencies.reduce((acc, clave) =>{
            acc[clave] = {}
            return acc
        }, {}); //Convierte el Array de currencies en un objeto

        const objectLanguages = countryLanguages.reduce((acc, clave) =>{
            acc[clave] = ''
            return acc
        }, {}); //Convierte el Array de languages en un objeto

        const country = await postCountry(
            countryFlag,
            countryName,
            countryCapitals,
            countryContinents,
            countryRegion,
            countrySubRegion,
            countryBorders,
            countryLatLong,
            countryArea,
            countryPopulation,
            objectLanguages,
            objectCurrencies,
            countryTimezones
        )

        if (country.length === 0) {
            
            return res.status(404).render('404', {
                title: '404'
            })
        }
        res.status(200).redirect(`/api/countries/${country._id}`);

    } catch (error) {
        
        res.status(500).render('500', {
            title: '500'
        })
    }
}


//PUT
export async function editCountryByIdController(req, res) {
    try {
        
        //Llama y refina los campos del cuerpo de la solicitud. 
            //Llama al id de la ruta url
            const {id} = req.params

            //Si req.body.countryFlag es una string vacía, lo elimina.
        if (req.body.countryFlag === '') {
            delete req.body.countryFlag
                                        //countryFlag: undefined.
        } 

        const {
            countryFlag, // aunque sea undefined, el modelo agrega valor "default".
            countryName,
            countryCapitals,
            countryContinents,
            countryRegion,
            countrySubRegion,
            countryBorders,
            countryLatLong,
            countryArea,
            countryPopulation,
            countryLanguages,
            countryCurrencies,
            countryTimezones
        } = req.body
       

        const objectCurrencies = countryCurrencies.reduce((acc, clave) =>{
            acc[clave] = {}
            return acc
        }, {}); //Convierte el Array de currencies en un objeto

        const objectLanguages = countryLanguages.reduce((acc, clave) =>{
            acc[clave] = ''
            return acc
        }, {}); //Convierte el Array de languages en un objeto

        
        const updatedCountry = {
            countryFlag,
            countryName,
            countryCapitals,
            countryContinents,
            countryRegion,
            countrySubRegion,
            countryBorders,
            countryLatLong,
            countryArea,
            countryPopulation,
            countryLanguages: objectLanguages,
            countryCurrencies: objectCurrencies,
            countryTimezones,
        };
        
            //Petición a repositorio de Mongoose
        const country = await editCountryById(id, updatedCountry)
        
        if (country.length === 0) {
            
            return res.status(404).render('404', { title: '404'})
        }
        res.status(200).redirect(`/api/countries/${country._id}`, {title: 'hello'});

    } catch (error) {
        
        res.status(500).render('500', { title: '500'})
    }
}

//DELETE
export async function removeCountryByIdController(req, res) {
    try {
        const {id} = req.params;
        const country = await removeCountryById(id);
        
        res.status(200).redirect(`/api/countries`);

    } catch (error) {
        
        res.status(500).render('500')
    }
}


export async function removeAllCountriesController(req, res) {

    try {
        const deletionResult = await removeAllCountries();

        res.status(200).json({ message: `${deletionResult.deletedCount} paises eliminados correctamente.` })
    } catch (error) {
        res.status(500).send('500', error)
    }
}
