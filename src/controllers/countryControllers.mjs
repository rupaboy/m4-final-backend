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
        }) //Pasamos datos avanzados al 'Dashboard'
        
    } catch (error) {
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
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
         //Vista Result Por Id
            
        );
    } catch (error) {
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
        
    }
}


export async function addNewCountryController(req, res) {
        res.render('addCountry', {title: 'Agregar un país'})
        //Vista de Agregar País
}

export async function editCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);

    res.render('editCountry', { title: `Editar ${country.name.nativeName.spa.common}`, country } )
    //Vista de Editar País
}

export async function removeCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);
    
    res.render('removeCountry', { title: `Borrar ${country.name.nativeName.spa.common}`, country } )
} //Vista de Borrar País


//POST
export async function postCountryController(req, res) {
    try {

        if (req.body.countryFlag === '') {
            delete req.body.countryFlag
        } //Si req.body.countryFlag es una string vacía, lo elimina.

        const currencies = req.body.countryCurrencies;
        const languages = req.body.countryLanguages;
        
        const countryCurrencies = currencies.reduce((acc, clave) =>{
            acc[clave] = {}
            return acc
        }, {}); //Convierte el Array de currencies en un objeto

        const countryLanguages = languages.reduce((acc, clave) =>{
            acc[clave] = ''
            return acc
        }, {}); //Convierte el Array de languages en un objeto


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
            countryGiniYearLatest,
            countryGiniValueLatest,
            countryTimezones
        } = req.body //Atrapa los elementos restantes del req.body

        const newCountry = {
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
            countryGiniYearLatest,
            countryGiniValueLatest,
            countryTimezones
        } //Y los guarda en un nuevo objeto newCountry 

        const country = await postCountry(newCountry) //(así será más claro el parámetro a enviar)
 
        if (country.length === 0) {
             
            return res.status(404).render('404', {
                title: '404'
            })
        }
        res.status(200).redirect(`/api/countries/${country._id}`);
        //Redirige a vista Result del país creado.

    } catch (error) {
        
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
    }
}


//PUT
export async function editCountryByIdController(req, res) {
    try {
        
            
            //Llama al id de la ruta url
            const {id} = req.params
            const flag = req.body.countryFlag
            if (flag === '') {
                req.body.countryFlag = 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Jolly-Roger3.svg'
            }

            const currencies = req.body.countryCurrencies;
            const languages = req.body.countryLanguages;
            
            const countryCurrencies = currencies.reduce((acc, clave) =>{
                acc[clave] = {}
                return acc
            }, {}); //Convierte el Array de currencies en un objeto
    
            const countryLanguages = languages.reduce((acc, clave) =>{
                acc[clave] = ''
                return acc
            }, {}); //Convierte el Array de languages en un objeto
    
            //console.log(flag)
                        //Si req.body.countryFlag es una string vacía, lo elimina.
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
                countryGiniYearLatest,
                countryGiniValueLatest,
                countryTimezones
            } = req.body //Atrapa los elementos restantes del req.body

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
                countryLanguages,
                countryCurrencies,
                countryGiniYearLatest,
                countryGiniValueLatest,
                countryTimezones,
            } //Y los guarda en un nuevo objeto updatedCountry 
        
        const country = await editCountryById(id, updatedCountry)
        
        if (country.length === 0) {
            
            return res.status(404).render('404', {title: '404'})
        }
        res.status(200).redirect(`/api/countries/${country._id}`);
        //redirige a Result con la Vista del país editado

    } catch (error) {
        
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
    }
}

//DELETE
export async function removeCountryByIdController(req, res) {
    try {
        const {id} = req.params;
        const country = await removeCountryById(id);
        //La variable country no la estamos usando.

        res.status(200).redirect(`/api/countries`);
        //redirige a la vista general del dashboard
    } catch (error) {
        
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
    }
}


export async function removeAllCountriesController(req, res) {
    //Función para desarrolladores. Comentada por defecto.
    // Hay otro método mas apropiado llamado drop(), pero no es este el caso de uso.
    try {
        const deletionResult = await removeAllCountries();

        res.status(200).json({ message: `${deletionResult.deletedCount} paises eliminados correctamente.` })
        //Retorna un JSON
    } catch (error) {
        res.status(500).render('500', {title: 'Error de datos del servidor', error})
    }
}
