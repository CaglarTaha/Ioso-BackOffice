// src/routes/organization-invites/index.routes.ts
import { Router } from 'express';
import organizationInviteRoutes from './organization-invite.routes';

const router = Router();

router.use('/', organizationInviteRoutes);

export default router;
