import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().required(),
  domain: Joi.string().uri().optional(),
});
