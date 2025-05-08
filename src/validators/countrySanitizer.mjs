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
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del país admite entre 3 y 60 caractéres.'),

    body('countryCapitals')
        .exists().withMessage('El ')
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
            const array = value.split(',')
            
            return array
        }),

    body('countryContinents')
    .trim()
    .escape()
    .customSanitizer( (value) => {
        const array = value.split(',')
        
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
        const array = value.split(',')
        
        return array
    }),

    body('countryLatLong')
    .trim()
    .escape()
    .customSanitizer( (value) => {
        const array = value.split(',')
        
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
        const array = value.split(',')
        
        return array
    }),

    body('countryCurrencies')
    .trim()
    .escape()
    .customSanitizer( (value) => {
        const array = value.split(',')
        
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