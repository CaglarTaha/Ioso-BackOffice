// src/controllers/calendar-event/calendar-event.controller.ts
import { Request, Response } from 'express';
import { CalendarEventService } from '../../services/calendar-event.service';
import { createCalendarEventSchema, updateCalendarEventSchema } from '../../validators/calendar-event.validator';
import { AuthenticatedRequest } from '../../interfaces/common.interface';

export class CalendarEventController {
  private calendarEventService = new CalendarEventService();

  createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { error, value } = createCalendarEventSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const event = await this.calendarEventService.createEvent(value, req.user.id);
    
    if (!event) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.status(201).json(event);
    return;
  };

  getEventsByOrganization = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    const events = await this.calendarEventService.getEventsByOrganization(organizationId);
    res.json(events);
    return;
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const event = await this.calendarEventService.getEventById(id);
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(event);
    return;
  };

  updateEvent = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { error, value } = updateCalendarEventSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const event = await this.calendarEventService.updateEvent(id, value);
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(event);
    return;
  };

  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const deleted = await this.calendarEventService.deleteEvent(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(204).send();
    return;
  };

  getEventsByDateRange = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const events = await this.calendarEventService.getEventsByDateRange(organizationId, startDate, endDate);
    res.json(events);
    return;
  };

  getUserEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const events = await this.calendarEventService.getUserEvents(req.user.id);
    res.json(events);
    return;
  };

  // Yeni endpoint'ler: Google Calendar benzeri özellikler
  checkUserAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const busyEvents = await this.calendarEventService.checkUserAvailability(req.user.id, startDate, endDate);
    res.json({ 
      userId: req.user.id,
      period: { startDate, endDate },
      busySlots: busyEvents 
    });
    return;
  };

  getOrganizationCalendarView = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const events = await this.calendarEventService.getOrganizationCalendarView(organizationId, startDate, endDate);
    res.json(events);
    return;
  };

  getAllMembersEvents = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const groupedEvents = await this.calendarEventService.getAllMembersEvents(organizationId, startDate, endDate);
    res.json(groupedEvents);
    return;
  };

  findFreeTimeSlots = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    const duration = parseInt(req.query.duration as string) || 60; // default 60 dakika
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const freeSlots = await this.calendarEventService.findTimeSlots(organizationId, duration, startDate, endDate);
    res.json({ 
      organizationId,
      duration: `${duration} minutes`,
      period: { startDate, endDate },
      freeSlots 
    });
    return;
  };
}