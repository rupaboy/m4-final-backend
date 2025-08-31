import { body } from "express-validator";

export const userCreateBodyValidator = [
    body("username")
        .exists().withMessage("Username required").bail()
        .trim()
        .notEmpty().withMessage("Username cannot be empty").bail()
        .isAlpha().withMessage("Username must contain only letters").bail()
        .isLength({ min: 5, max: 20 }).withMessage("Username admits between five to twenty characters"),

    body("email")
        .exists().withMessage("Email required").bail()
        .trim()
        .isEmail().withMessage("Invalid email").bail()
        .normalizeEmail(),

    body("password")
        .exists().withMessage("Password required").bail()
        .isLength({ min: 6, max: 32 }).withMessage('Passwords must have between six to thirty two characters'),

    body("location")
        .exists().withMessage('A country Alpha-2 code is required for this request').bail()
        .trim()
        .notEmpty().withMessage('Country alpha-2 code cannot be an empty string').bail()
        .isString().withMessage('Countries alpha-2 codes must be string values').bail()
        .isAlpha().withMessage('Country code must contain only letters').bail()
        .isLength({ min: 2, max: 2 }).withMessage('country code must be exactly 2 characters').bail()
        .toUpperCase(),

    body("role")
        .exists().withMessage("Role required").bail()
        .isString().withMessage("Role must be a string").bail()
        .isLength({ min: 4, max: 5 }).withMessage('role names admit 4 or 5 characters')
];

export const userUpdateBodyValidator = [
  body("username").optional()
    .trim()
    .notEmpty().withMessage("Username cannot be empty").bail()
    .matches(/^(?=(?:.*[A-Za-z]){3,})[A-Za-z0-9]+$/)
      .withMessage("Username must contain at least 3 letters and optional numbers, no other characters")
    .isLength({ min: 3, max: 50 }).withMessage("Username admits between three to fifty characters"),

  body("email").optional()
    .trim()
    .isEmail().withMessage("Invalid email").bail()
    .normalizeEmail(),

  body("password").optional()
    .isLength({ min: 6, max: 100 })
      .withMessage('Passwords must have between six to one hundred characters'),

  body("location").optional()
    .trim()
    .notEmpty().withMessage('Country alpha-2 code cannot be an empty string').bail()
    .isString().withMessage('Countries alpha-2 codes must be string values').bail()
    .isAlpha().withMessage('Country code must contain only letters').bail()
    .isLength({ min: 2, max: 2 }).withMessage('Country code must be exactly 2 characters').bail()
    .toUpperCase(),

  body("role").optional()
    .isString().withMessage("Role must be a string").bail()
    .isLength({ min: 4, max: 5 }).withMessage('Role names admit 4 or 5 characters')
];

export const radioCreateBodyValidator = [
  body("stationuuid")
    .exists().withMessage("UUID required").bail()
    .trim()
    .notEmpty().withMessage("UUID can't be empty").bail()
    .isUUID().withMessage("Invalid UUID format"),

  body("name")
    .exists().withMessage("Name required").bail()
    .trim()
    .notEmpty().withMessage("Name cannot be empty").bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("Station names admit between three and eighty characters"),

  body("tags")
    .exists().withMessage("No tags property found").bail()
    .customSanitizer(value => {
      if (Array.isArray(value)) {
        value = value.join(",");
      }
      return [...new Set(
        value
          .split(",")
          .map(t => t.trim().toLowerCase())
          .filter(Boolean)
      )];
    })
    .isArray().withMessage("Tags must be an array of strings"),

  body("score")
    .optional({ nullable: true })
    .customSanitizer(value => value === "" ? null : value)
    .custom(value => {
      if (value === null) return true; // permite null
      if (!Number.isInteger(Number(value))) throw new Error("Score must be an integer between 0 and 5");
      if (value < 0 || value > 5) throw new Error("Score must be between 0 and 5");
      return true;
    }),

  body("url_resolved")
    .exists().withMessage("url_resolved is required").bail()
    .trim()
    .notEmpty().withMessage("url_resolved cannot be empty").bail()
    .isURL({ require_protocol: true }).withMessage("url_resolved must be a valid URL"),

  body("state")
    .optional({ nullable: true })
    .customSanitizer(value => value === "" ? null : value)
    .isLength({ min: 3, max: 80 }).withMessage("State names admit between three and eighty characters"),

  body("countryCode")
    .exists().withMessage('A country Alpha-2 code is required').bail()
    .trim()
    .notEmpty().withMessage('Country code cannot be empty').bail()
    .isString().withMessage('Country code must be string').bail()
    .isAlpha().withMessage('Country code must contain only letters').bail()
    .isLength({ min: 2, max: 2 }).withMessage('Country code must be exactly 2 characters').bail()
    .toUpperCase()
];