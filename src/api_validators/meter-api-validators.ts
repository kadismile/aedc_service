import Joi from '@hapi/joi';

import { METER_STATUS, METER_TYPE } from '../types/meter.js';

export const createMeterApiValidator = Joi.object({
  meterNumber: Joi.string().required(),
  barcode: Joi.string().required(),
  typeOfMeter: Joi.string().valid(METER_TYPE).required(),
  meterStatus: Joi.string().required(),
  vendor: Joi.string().required()
});

export const updateMeterApiValidator = Joi.object({
  meterStatus: Joi.string()
    .valid(...Object.values(METER_STATUS))
    .required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    state: Joi.string().required()
  }).required()
});
