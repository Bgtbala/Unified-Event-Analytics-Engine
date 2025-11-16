import Joi from "joi";

export const collectEventSchema = Joi.object({
  event: Joi.string().required(),
  url: Joi.string().uri().optional(),
  referrer: Joi.string().uri().allow("", null),
  device: Joi.string().optional(),
  ipAddress: Joi.string().optional(),
  timestamp: Joi.date().iso().optional(),
  userId: Joi.string().optional(),
  metadata: Joi.object().optional(),
});
