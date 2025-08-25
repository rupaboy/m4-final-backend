import { validationResult } from "express-validator";

export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map(err => `${err.msg || 'Validation error'} (${err.param || 'unknown'} in ${err.location || 'unknown location'})`)
      .join(', ');


    return res.status(400).json({
      message: 'Data validation error',
      errorMessages
    });
  }

  next();
};
