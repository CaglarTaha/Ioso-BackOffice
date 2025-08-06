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