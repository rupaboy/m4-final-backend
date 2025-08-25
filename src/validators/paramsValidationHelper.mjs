import { param } from 'express-validator';

//MONGO _ID
export const idParamValidator = [
    param("id")
        .exists().withMessage("ID is required").bail()
        .trim()
        .isMongoId().withMessage("Invalid MongoDB ObjectId")
];

//COUNTRY
export const codeParamValidator = [
    param("code")
        .exists().withMessage('A country Alpha-2 code is required for this request').bail()
        .trim()
        .notEmpty().withMessage('Country alpha-2 code cannot be an empty string').bail()
        .isString().withMessage('Countries alpha-2 codes must be string values').bail()
        .isAlpha().withMessage('Country code must contain only letters').bail()
        .isLength({ min: 2, max: 2 }).withMessage('country code must be exactly 2 characters').bail()
        .toUpperCase()
];

//USER
export const usernameParamValidator = [
    param("username")
    .exists().withMessage('A username is required').bail()
    .trim()
    .notEmpty().withMessage('Username cannot be empty').bail()
    .isString().withMessage('Username must be a string').bail()
    .isAlpha().withMessage('Username must contain only letters').bail()
    .isLength({ min: 3, max: 50 }).withMessage('Usernames must be between 3 and 50 characters')
];

export const emailParamValidator = [
    param("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isString().withMessage("Email must be a string").bail()
        .isEmail().withMessage("Must be a valid email address").bail()
        .normalizeEmail() //lowercase + invalid character removal
];

const allowedFields = ["username", "email", "password", "location", "role"];

export const fieldParamValidator = [
    param("field")
        .exists().withMessage("Field is required").bail()
        .trim()
        .isString().withMessage("Field must be a string")
        .isLength({ min: 3, max: 20 }).withMessage("Field must be between 3 and 20 characters")
        .custom(value => {
            if (!allowedFields.includes(value)) {
                throw new Error(`Field must be one of: ${allowedFields.join(", ")}`);
            }
            return true;
        })
];

//MARKERS
export const nameParamValidator = [
    param("name")
        .exists().withMessage('A name is required').bail()
        .trim()
        .notEmpty().withMessage('A name cannot be an empty string.').bail()
        .isLength({ min: 3, max: 50 }).withMessage('Names admit between three to fifty characters.')
];

export const pageParamValidator = [
    param("page")
        .optional()
        .isInt({ min: 1, max: 99 }).withMessage("Page numbers must be integers from zero to ninety nine")
        .toInt()
];

export const scoreParamValidator = [
param("score")
    .exists().withMessage("A score value is required").bail()
    .isInt({ min: 0, max: 5 }).withMessage("Score must be an integer between 1 and 5").bail()
    .toInt()
];