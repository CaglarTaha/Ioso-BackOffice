// src/routes/calendar-events/calendar-event.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { CalendarEventController } from '../../controllers/calendar-event/calendar-event.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const calendarEventController = new CalendarEventController();

// Temel CRUD işlemleri
router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(calendarEventController.createEvent));
router.get('/my', authenticateToken(["User", "Admin"]), asyncWrap(calendarEventController.getUserEvents));
router.get('/organization/:organizationId', asyncWrap(calendarEventController.getEventsByOrganization));
router.get('/organization/:organizationId/date-range', asyncWrap(calendarEventController.getEventsByDateRange));
router.get('/:id', asyncWrap(calendarEventController.getEventById));
router.put('/:id', authenticateToken(["User", "Admin"]), asyncWrap(calendarEventController.updateEvent));
router.delete('/:id', authenticateToken(["User", "Admin"]), asyncWrap(calendarEventController.deleteEvent));

// Yeni Google Calendar benzeri özellikler
router.get('/my/availability', authenticateToken(["User", "Admin"]), asyncWrap(calendarEventController.checkUserAvailability));
router.get('/organization/:organizationId/calendar-view', asyncWrap(calendarEventController.getOrganizationCalendarView));
router.get('/organization/:organizationId/all-members', asyncWrap(calendarEventController.getAllMembersEvents));
router.get('/organization/:organizationId/free-slots', asyncWrap(calendarEventController.findFreeTimeSlots));

export default router;