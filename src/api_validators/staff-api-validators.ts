import Joi from '@hapi/joi';

import { STAFF_REGION, STAFF_ROLE } from '../types/staff.js';

export const createStaffApiValidator = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  vendor: Joi.string(),
  role: Joi.string()
    .valid(...Object.values(STAFF_ROLE))
    .required(),
  staffRegion: Joi.string()
    .valid(...Object.values(STAFF_REGION))
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string().required()
});

export const staffLoginApiValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required()
});

export const updateStaffApiValidator = Joi.object({
  fullName: Joi.string(),
  vendor: Joi.string(),
  role: Joi.string()
    .valid(...Object.values(STAFF_ROLE))
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  phoneNumber: Joi.string(),
  id: Joi.string().required(),
  isActive: Joi.boolean(),
  staffRegion: Joi.string().valid(...Object.values(STAFF_REGION))
});

export const changePasswordApiValidator = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
});

export const resetPasswordApiValidator = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } })
});
