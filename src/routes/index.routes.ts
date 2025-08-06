// src/routes/index.routes.ts
import { Router } from "express";
import roleRoutes from "./roles/index.routes";
import userRoutes from "./users/index.routes";
import organizationRoutes from "./organizations/index.routes";
import calendarEventRoutes from "./calendar-events/index.routes";
import organizationInviteRoutes from "./organization-invites/index.routes";
const router = Router();

// Mevcut user ve role routes'lar (kendi path'lerini kullanır)
router.use(roleRoutes);
router.use(userRoutes);

// Yeni organizasyon ve events routes'lar
router.use('/api/organizations', organizationRoutes);
router.use('/api/events', calendarEventRoutes);
router.use('/api/invites', organizationInviteRoutes);

export default router;
