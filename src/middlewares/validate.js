// src/middlewares/validate.js
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          error.details.map(d => d.message)
        )
      );
    }

    // Always set validation result
    req.validation = { value };

    // Normalize request body/query/params
    req[property] = value;

    next();
  };
};
