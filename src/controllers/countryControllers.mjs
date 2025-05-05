import {
    getAllCountries,
    getCountryById,
    addNewCountry,
    editCountry,
    deleteCountry,
    postCountry,
    editCountryById,
    removeCountryById,
//  removeAllCountries,
} from '../services/countryServices.mjs';


//GET
export async function getAllCountriesController(req, res) {
    
    try {
        const countries = await getAllCountries();

        res.status(200).json(countries)
    } catch (error) {
        res.status(500).send('500', error)
    }
}

 
export async function getCountryByIdController(req, res) {
    try {
        const {id} = req.params;
        const countries = await getCountryById(id);
        
        if (!countries) {
            return res.status(404).render('404')
        }
        res.render('result', {countries});
    } catch (error) {
        res.status(500).render('500', {error})
    }
}

export async function addNewCountryController(req, res) {
    res.render('addCountry' )
}

export async function editCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);

    res.render('editCountry', { country } )
}

export async function removeCountryController(req, res) {
    const {id} = req.params;
    const country = await getCountryById(id);
    
    res.render('removeCountry', { country } )
}


//POST
export async function postCountryController(req, res) {
    try {
        const {countryData} = req.body
        
        const country = await postCountry(countryData)
        if (country.length === 0) {
            
            return res.status(404).render('404')
        }
        res.status(200).redirect(`/api/countries/${country._id}`);

    } catch (error) {
        
        res.status(500).render('500')
    }
}


//PUT
export async function editCountryByIdController(req, res) {
    try {
        const {id} = req.params
        const updatedCountry = req.body
    
        const country = await editarSuperheroePorId(id, updatedCountry)
        
        if (country.length === 0) {
            
            return res.status(404).render('404')
        }
        res.status(200).redirect(`/api/countries/${country._id}`);

    } catch (error) {
        
        res.status(500).render('500')
    }
}

//DELETE
export async function removeCountryByIdController(req, res) {
    try {
        const {id} = req.params;
        const country = await removeCountryById(id);
        //console.log(Country Borrado)
        if (country.lenght === 0) {
            
            return res.status(404).render('404')
        }
        res.status(200).redirect(`/api/countries`);

    } catch (error) {
        
        res.status(500).render('500')
    }
}

/*
export async function removeAllCountriesController(req, res) {

    try {
        const deletionResult = await removeAllCountries();

        res.status(200).json({ message: `${deletionResult.deletedCount} paises eliminados correctamente.` })
    } catch (error) {
        res.status(500).send('500', error)
    }
}
*/