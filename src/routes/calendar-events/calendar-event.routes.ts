// src/routes/calendar-events/calendar-event.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { CalendarEventController } from '../../controllers/calendar-event/calendar-event.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /calendar-events:
 *   post:
 *     summary: Create a new calendar event
 *     tags: [Calendar Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(CalendarEventController.createEvent));
/**
 * @swagger
 * /calendar-events/my:
 *   get:
 *     summary: Get user's calendar events
 *     tags: [Calendar Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User events retrieved successfully
 */
router.get('/my', authenticateToken(["User", "Admin"]), asyncWrap(CalendarEventController.getUserEvents));
router.get('/organization/:organizationId', asyncWrap(CalendarEventController.getEventsByOrganization));
router.get('/organization/:organizationId/date-range', asyncWrap(CalendarEventController.getEventsByDateRange));
/**
 * @swagger
 * /calendar-events/{id}:
 *   get:
 *     summary: Get calendar event by ID
 *     tags: [Calendar Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 */
router.get('/:id', asyncWrap(CalendarEventController.getEventById));
router.put('/:id', authenticateToken(["User", "Admin"]), asyncWrap(CalendarEventController.updateEvent));
/**
 * @swagger
 * /calendar-events/{id}:
 *   delete:
 *     summary: Delete calendar event by ID
 *     tags: [Calendar Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Event deleted successfully
 */
router.delete('/:id', authenticateToken(["User", "Admin"]), asyncWrap(CalendarEventController.deleteEvent));

// Yeni Google Calendar benzeri özellikler
router.get('/my/availability', authenticateToken(["User", "Admin"]), asyncWrap(CalendarEventController.checkUserAvailability));
router.get('/organization/:organizationId/calendar-view', asyncWrap(CalendarEventController.getOrganizationCalendarView));
router.get('/organization/:organizationId/all-members', asyncWrap(CalendarEventController.getAllMembersEvents));
router.get('/organization/:organizationId/free-slots', asyncWrap(CalendarEventController.findFreeTimeSlots));

export default router;