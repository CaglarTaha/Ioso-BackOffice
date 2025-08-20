// src/controllers/calendar-event/calendar-event.controller.ts
import { Request, Response } from 'express';
import { CalendarEventService } from '../../services/calendar-event.service';
import { createCalendarEventSchema, updateCalendarEventSchema } from '../../validators/calendar-event.validator';
import { AuthenticatedRequest } from '../../interfaces/common.interface';
import { validate } from '../../utils/common.utils';

const calendarEventService = new CalendarEventService();

export class CalendarEventController {

  static async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = validate(req.body, createCalendarEventSchema);
    const event = await calendarEventService.createEvent(data, req.user.id);
    
    if (!event) {
      res.status(404).json({ message: 'Organization not found' });
      ;
    }

    res.status(201).json({ data: event });
  }

  static async getEventsByOrganization(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const events = await calendarEventService.getEventsByOrganization(organizationId);
    res.json({ data: events });
  }

  static async getEventById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const event = await calendarEventService.getEventById(id);
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      ;
    }

    res.json({ data: event });
  }

  static async updateEvent(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const data = validate(req.body, updateCalendarEventSchema);
    const event = await calendarEventService.updateEvent(id, data);
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      ;
    }

    res.json({ data: event });
  }

  static async deleteEvent(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const deleted = await calendarEventService.deleteEvent(id);
    
    if (!deleted) {
      res.status(404).json({ message: 'Event not found' });
      ;
    }

    res.status(204).send();
  }

  static async getEventsByDateRange(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      ;
    }

    const events = await calendarEventService.getEventsByDateRange(organizationId, startDate, endDate);
    res.json({ data: events });
  }

  static async getUserEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
    const events = await calendarEventService.getUserEvents(req.user.id);
    res.json({ data: events });
  }

  // Yeni endpoint'ler: Google Calendar benzeri özellikler
  static async checkUserAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      ;
    }

    const busyEvents = await calendarEventService.checkUserAvailability(req.user.id, startDate, endDate);
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
      res.status(400).json({ message: 'Invalid date format' });
      ;
    }

    const events = await calendarEventService.getOrganizationCalendarView(organizationId, startDate, endDate);
    res.json({ data: events });
  }

  static async getAllMembersEvents(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      ;
    }

    const groupedEvents = await calendarEventService.getAllMembersEvents(organizationId, startDate, endDate);
    res.json(groupedEvents);
  }

  static async findFreeTimeSlots(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    const duration = parseInt(req.query.duration as string) || 60;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      ;
    }

    const freeSlots = await calendarEventService.findTimeSlots(organizationId, duration, startDate, endDate);
    res.json({ 
      organizationId,
      duration: `${duration} minutes`,
      period: { startDate, endDate },
      freeSlots 
    });
    ;
  }
}