import { validationResult } from "express-validator";


export const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    //console.log('Validation handler: Log of errors: ', errors)
    if (!errors.isEmpty()) {
        
        const errorMessages = errors.array().map(error => `${error.msg} (${errors.path})`).join(', ');

        
        return res.render('400', {title: 'Error de validación de datos: ', errorMessages })
    }
    next()
};
