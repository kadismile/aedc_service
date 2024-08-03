import Joi from '@hapi/joi';

import { METER_TYPE } from '../types/meter.js';

export const createMeterApiValidator = Joi.object({
  meterNumber: Joi.string().required(),
  barcode: Joi.string().required(),
  typeOfMeter: Joi.string().valid(METER_TYPE).required(),
  meterStatus: Joi.string().required(),
  vendor: Joi.string().required()
});

export const updateMeterApiValidator = Joi.object({
  meterStatus: Joi.string().required()
});
