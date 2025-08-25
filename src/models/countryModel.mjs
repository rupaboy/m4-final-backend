
    import mongoose from "mongoose";

    const countrySchema = new mongoose.Schema({
        
        code: { type: String, required: true },
        name: { type: String, required: true },
        area: { type: Number, required: true },
        population: { type: Number, required: true },
        continents: { type: [String], required: true },
        flag: { type: String, required: false },
        languages: { type: [String], required: true },
        capitals: { type: [String], required: true },
        borders: { type: [String], required: false },
        timezones: { type: [String], required: true },
    }, { timestamps: true });

    const Country = mongoose.model(
        'country',
        countrySchema,
        'countries'
    );
    export default Country
    
    