// src/routes/organizations/index.routes.ts
import { Router } from 'express';
import organizationRoutes from './organization.routes';

const router = Router();

router.use('/', organizationRoutes);

export default router;