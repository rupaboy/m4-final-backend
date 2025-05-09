import {body} from 'express-validator';

export const countryValidations = () => [

    body('countryFlag')
        .trim()
        .isURL({ require_protocol: true }).withMessage('La URL es invalida.')
        .isLength({ min: 21, max: 120 }).withMessage('La URL de la bandera admite entre 21 y 120 caractéres.'),

    body('countryName')
        .exists().withMessage('El nombre del país es requerido.')
            .bail()
        .trim()
        .notEmpty().withMessage('El nombre del país no puede expresarse como una cadena vacía de texto.')
            .bail()
        .isLength({ min: 3, max: 90 }).withMessage('El nombre del país admite entre 3 y 60 caractéres.'),

    body('countryCapitals')
        .exists().withMessage('El nombre de una capital es requerido.')
        .isArray().withMessage('Las capitales deben concatenarse como un vector separado por comas (,).')
        .isLength({ min: 1 }).withMessage('El país debe tener al menos una capital'),

    body('countryCapitals.*')
        .isLength({ min: 3, max: 90 }).withMessage('El nombre de las capitales admite entre 3 y 90 caractéres.'),

    body('countryContinents')
        .exists().withMessage('El continente es requerido.')
        .isArray().withMessage('Los continentes deben concatenarse como un vector separado por comas (,).')
        .isLength({ min: 1 }).withMessage('El país debe situarse en al menos un continente.'),

    body('countryContinents.*')
        .isLength({ min: 3, max: 90 }).withMessage('El país debe situarse en al menos un continente.'),
    
    body('countryRegion')
        .trim()
        .isLength({ min: 3, max: 90 }).withMessage('El nombre de la región admite entre 3 y 60 caractéres.'),
    
    body('countrySubRegion')
        .trim()
        .isLength({ min: 3, max: 90 }).withMessage('El nombre de la sub-Region admite entre 3 y 60 caractéres.'),

    body('countryBorders')
        .isArray().withMessage('Las fronteras deben concatenarse como un vector separado por comas (,).'),

    body('countryBorders.*')
        .isLength({ min: 3, max: 3 }).withMessage('Cada código de fronteras debe ser una cadena de 3 caractéres.'),

    body('countryLatLong')
        .exists().withMessage('La longitud y latitud deben quedar especificadas.')
        .isArray().withMessage('Las coordenadas deben concatenarse como un vector separado por comas (,).'),

    body('countryLatLong.*')
        .exists().withMessage('Longitud y latitud son valores requeridos.')
        .isLength({ min: 3, max: 9 }).withMessage('Longitudes y latitudes deben expresarse con entre 3 y 9 digitos.'),

    body('countryArea')
        .exists().withMessage('El área de extensión es requerida.')
        .isNumeric().withMessage('El area de extensión debe ser numérica.')
        .isFloat().withMessage('El área de extensión debe expresarse como un valor positivo'),

    body('countryPopulation')
        .exists().withMessage('La cifra de población es requerida.')
        .isNumeric().withMessage('La cifra de población debe ser numérica.')
        .isFloat().withMessage('La cifra de población debe expresarse como un valor positivo')
        .isInt().withMessage('La cifra de población debe expresarse como un valor entero (no-decimal)'),

    body('countryLanguages')
        .isArray().withMessage('Los idiomas deben concatenarse como un vector separado por comas (,).'),
    
        body('countryLanguages.*')
        .isLength({ min: 3, max: 3 }).withMessage('Cada código de idioma debe ser una cadena de 3 caractéres.'),

    body('countryCurrencies')
        .isArray().withMessage('Las monedas deben concatenarse como un vector separado por comas (,).'),

    body('countryCurrencies.*')
        .isLength({ min: 3, max: 3 }).withMessage('Cada código de moneda debe ser una cadena de 3 caractéres.'),
/*
    body('countryGiniYearLatest')
        .isArray().withMessage('Los índices Gini son un array. Su funcionalidad está en desarrollo. Disculpe.'),
*/
    body('countryGiniYearLatest.*')
        .isNumeric().withMessage('El año del informe Gini debe ser numérico.')
        .isFloat().withMessage('El número de año del índice Gini debe expresarse como un valor positivo')
        .isInt().withMessage('El año del informe Gini debe expresarse como un valor entero (no-decimal)'),

    body('countryGiniValueLatest.*')
        .isNumeric().withMessage('El año del informe Gini debe ser numérico.')
        .isFloat().withMessage('El número de año del índice Gini debe expresarse como un valor positivo')
        .isInt({ min: 0, max: 100}).withMessage('El año del informe Gini debe expresarse como un valor entre 0 y 100 no-decimal'),

    body('countryTimezones')
        .isArray().withMessage('Las zonas horarias son un array. Su funcionalidad está en desarrollo. Disculpe.'),

]

export const countrySanitizer = () => [

    body('countryFlag')
        .trim(),

    body('countryName')
    .trim()
    .escape(),

    body('countryCapitals')
        .trim()
        .escape()
        .customSanitizer( (value) => {

            if (value.includes(',')) {
                const array = value.split(',')
            
                return array
            }
            const array = [value]
            return array

        }),

    body('countryContinents')
    .trim()
    .escape()
    .customSanitizer( (value) => {

        if (value.includes(',')) {
            const array = value.split(',')
        
            return array
        }
        const array = [value]
        return array

    }),

    body('countryRegion')
    .trim()
    .escape(),

    body('countrySubRegion')
    .trim()
    .escape(),

    body('countryBorders')
    .trim()
    .escape()
    .customSanitizer( (value) => {

        if (value.includes(',')) {
            const array = value.split(',')
        
            return array
        }
        const array = [value]
        return array

    }),

    body('countryLatLong')
    .trim()
    .escape()
    .customSanitizer( (value) => {

        if (value.includes(',')) {
            const array = value.split(',')
        
            return array
        }
        const array = [value]
        return array

    }),

    body('countryArea')
    .trim()
    .escape(),

    body('countryPopulation')
    .trim()
    .escape(),

    body('countryLanguages')
    .trim()
    .escape()
    .customSanitizer( (value) => {

        if (value.includes(',')) {
            const array = value.split(',')
        
            return array
        }
        const array = [value]
        return array

    }),

    body('countryCurrencies')
    .trim()
    .escape()
    .customSanitizer( (value) => {

        if (value.includes(',')) {
            const array = value.split(',')
        
            return array
        }
        const array = [value]
        return array

    }),

    body('countryTimezones')
    .trim()
    .escape()
    .customSanitizer( (value) => {
        const array = [value]
        
        return array
    }),



]