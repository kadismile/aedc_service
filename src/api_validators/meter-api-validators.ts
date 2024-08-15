import Joi from '@hapi/joi';

import { METER_STATUS, METER_TYPE } from '../types/meter.js';

export const createMeterApiValidator = Joi.object({
  meterNumber: Joi.string().required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    state: Joi.string().required()
  }).required(),
  barcode: Joi.string().required(),
  typeOfMeter: Joi.string()
    .valid(...Object.values(METER_TYPE))
    .required(),
  meterStatus: Joi.string()
    .valid(...Object.values(METER_STATUS))
    .required()
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

export const assignMeterApiValidator = Joi.object({
  meterId: Joi.string().required(),
  staffId: Joi.string().required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    state: Joi.string().required()
  }).required()
});

export const assignMeterToCustomerApiValidator = Joi.object({
  meterId: Joi.string().required(),
  customerId: Joi.string().required(),
  address: Joi.object({
    fullAddress: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    state: Joi.string().required()
  }).required()
});
