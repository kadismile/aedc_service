import Joi from '@hapi/joi';

import { METER_STATUS, METER_TYPE } from '../types/meter.js';

export const createMeterApiValidator = Joi.object({
  meterNumber: Joi.string().required(),
  barcode: Joi.string().required(),
  typeOfMeter: Joi.string().valid(...Object.values(METER_TYPE)).required(),
  meterStatus: Joi.string().valid(...Object.values(METER_STATUS)).required(),
  vendor: Joi.string().required()
});

export const updateMeterApiValidator = Joi.object({
  meterStatus: Joi.string().valid(...Object.values(METER_STATUS)).required()
});
