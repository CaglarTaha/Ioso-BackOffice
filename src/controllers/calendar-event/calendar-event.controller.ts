// src/controllers/calendar-event/calendar-event.controller.ts
import { Request, Response } from 'express';
import { CalendarEventService } from '../../services/calendar-event.service';
import { createCalendarEventSchema, updateCalendarEventSchema } from '../../validators/calendar-event.validator';
import { AuthenticatedRequest } from '../../interfaces/common.interface';
import { validate } from '../../utils/common.utils';

export class CalendarEventController {

  static async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = validate(req.body, createCalendarEventSchema);
    const event = await CalendarEventService.createEvent(data, req.user.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(201).json({ data: event });
  }

  static async getEventsByOrganization(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const events = await CalendarEventService.getEventsByOrganization(organizationId);
    res.json({ data: events });
  }

  static async getEventById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const event = await CalendarEventService.getEventById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ data: event });
  }

  static async updateEvent(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const data = validate(req.body, updateCalendarEventSchema);
    const event = await CalendarEventService.updateEvent(id, data);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ data: event });
  }

  static async deleteEvent(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const deleted = await CalendarEventService.deleteEvent(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(204).send();
  }

  static async getEventsByDateRange(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const events = await CalendarEventService.getEventsByDateRange(organizationId, startDate, endDate);
    res.json({ data: events });
  }

  static async getUserEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
    const events = await CalendarEventService.getUserEvents(req.user.id);
    res.json({ data: events });
  }

  // Yeni endpoint'ler: Google Calendar benzeri özellikler
  static async checkUserAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const busyEvents = await CalendarEventService.checkUserAvailability(req.user.id, startDate, endDate);
    res.json({ 
      userId: req.user.id,
      period: { startDate, endDate },
      busySlots: busyEvents 
    });
  }

  static async getOrganizationCalendarView(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const events = await CalendarEventService.getOrganizationCalendarView(organizationId, startDate, endDate);
    res.json({ data: events });
  }

  static async getAllMembersEvents(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const groupedEvents = await CalendarEventService.getAllMembersEvents(organizationId, startDate, endDate);
    res.json(groupedEvents);
  }

  static async findFreeTimeSlots(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const duration = parseInt(req.query.duration as string) || 60;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const freeSlots = await CalendarEventService.findTimeSlots(organizationId, duration, startDate, endDate);
    res.json({ 
      organizationId,
      duration: `${duration} minutes`,
      period: { startDate, endDate },
      freeSlots 
    });
  }
}