
    import mongoose, { trusted } from "mongoose";


    const countrySchema = new mongoose.Schema({
        
        name: {
            common: {
                type: String, required: true
            },
    
            official: {
                type: String, required: false
            },
    
            nativeName: { 
                type: Map, //Permite acceder a las sub-propiedades de claves dinánimas.
                of: {
                    official: { type: String },
                    common: { type: String },
                    _id: false
                },
                required: false
            }
        },
    
        independent: { type: Boolean, required: false, default: true },
        status: { type: String, required: false, default: 'officially-assigned' },
        unMember: { type: Boolean, required: false, default: false },
        
        currencies: {
            type: Map, //Permite acceder a las sub-propiedades de claves dinánimas.
            of: {
                name: { type: String, required: false },
                symbol: { type: String, required: false, default: '$' },
                _id: false
            },
            required: true
        },
    
        capital: { type: [String], required: true },
        region: { type: String, required: false },
        subregion: { type: String, required: false },
    
        languages: { 
            type: Map, //Permite acceder a las sub-propiedades de claves dinánimas.
            of: String,
            required: true,
            _id: false
        },
    
        latlng: { type: [Number], required: true },
        landlocked: { type: Boolean, required: false },
        borders: { type: [String], required: false },
        area: { type: Number, required: true },
        flag: { type: String, required: false },
        
        maps: { 
            googleMaps: {
                type: String, required: false
            },
            openStreetMaps: {
                type: String, required: false
            }
        },
    
        population: { type: Number, required: true },
        
        gini: { 
            type: Map, //Permite acceder a las sub-propiedades de claves dinánimas.
            of: Number,
            required: false,
            _id: false
        },
        
        fifa: { type: String, required: false }, 
        timezones: { type: [String], required: true },
        continents: { type: [String], required: true },
        
        flags: { // Imágenes de la bandera.
            png: { type: String, required: false },
            svg: { type: String, required: false, default: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Jolly-Roger3.svg' },
            alt: { type: String, required: false } 
        },
        
        startOfWeek: { type: String, required: false, default: 'monday' },

        capitalInfo: {    
            latlng: { type: [Number], required: false },
        },
        
        creator: { type: String, required: false, default: 'Fernando Pais' },
        
    }, { timestamps: true });

    
    const Country = mongoose.model(
        'country', countrySchema, 'Grupo-08'
    );
    
    export default Country
    
    
    /*
    name: object
    independent: boolean
    status: string
    unMember: boolean
    currencies: object
    capital: object
    region: string
    subregion: string
    languages: object
    latlng: object
    landlocked: boolean
    area: number
    demonyms: object
    flag: string
    maps: object
    population: number
    fifa: string
    timezones: object
    continents: object
    flags: object
    startOfWeek: string
    capitalInfo: object
    */
    