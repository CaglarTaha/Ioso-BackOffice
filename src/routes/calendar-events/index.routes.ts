// src/routes/calendar-events/index.routes.ts
import { Router } from 'express';
import calendarEventRoutes from './calendar-event.routes';

const router = Router();

router.use('/', calendarEventRoutes);

export default router;