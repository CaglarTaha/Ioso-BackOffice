// src/validators/organization.validator.ts
import Joi from 'joi';

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional()
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional()
});

export const addMemberSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});

export const getOrganizationByIdDetailSchema = Joi.object({
  timeZone: Joi.string()
    .default('Europe/Istanbul')
    .pattern(/^([A-Za-z]+\/[A-Za-z_]+)$/) // IANA timezone formatı
    .optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date()
    .iso()
    .optional()
    .greater(Joi.ref('startDate'))
});