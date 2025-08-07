// src/routes/index.routes.ts
import { Router } from "express";
import roleRoutes from "./roles/index.routes";
import userRoutes from "./users/index.routes";
import organizationRoutes from "./organizations/index.routes";
import calendarEventRoutes from "./calendar-events/index.routes";
import organizationInviteRoutes from "./organization-invites/index.routes";
const router = Router();

// Tüm routes'lar /api prefix'i kullanacak
router.use('/api', roleRoutes);
router.use('/api', userRoutes);
router.use('/api/organizations', organizationRoutes);
router.use('/api/events', calendarEventRoutes);
router.use('/api/invites', organizationInviteRoutes);

export default router;
