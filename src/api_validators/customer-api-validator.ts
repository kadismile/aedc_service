import Joi from '@hapi/joi';

export const createCustomerApiValidator = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    state: Joi.string().valid('abuja', 'nassarawa', 'kogi', 'niger').required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    geocode: Joi.string().required()
  }).required()
});
