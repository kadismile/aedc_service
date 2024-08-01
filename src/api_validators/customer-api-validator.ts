import Joi from '@hapi/joi';

import { isValidState,normalizeState } from '../helpers/state_helper.js';

export const createCustomerApiValidator = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    state: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!isValidState(value)) {
          return helpers.error('any.invalid');
        }
        return normalizeState(value);
      }, 'State validation'),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    geocode: Joi.string().required()
  }).required()
});
