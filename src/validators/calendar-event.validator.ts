// src/validators/calendar-event.validator.ts
import Joi from 'joi';

export const createCalendarEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  organizationId: Joi.number().integer().positive().required(),
  eventType: Joi.string().valid('personal', 'meeting', 'event').optional().default('personal'),
  availability: Joi.string().valid('busy', 'free', 'tentative').optional().default('busy'),
  isVisible: Joi.boolean().optional().default(true)
});

export const updateCalendarEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  eventType: Joi.string().valid('personal', 'meeting', 'event').optional(),
  availability: Joi.string().valid('busy', 'free', 'tentative').optional(),
  isVisible: Joi.boolean().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.endDate <= value.startDate) {
    return helpers.error('any.custom', { message: 'End date must be after start date' });
  }
  return value;
});