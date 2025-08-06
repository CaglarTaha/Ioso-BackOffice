// src/routes/organizations/organization.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { OrganizationController } from '../../controllers/organization/organization.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const organizationController = new OrganizationController();

router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(organizationController.createOrganization));
router.get('/', asyncWrap(organizationController.getAllOrganizations));
router.get('/my', authenticateToken(["User", "Admin"]), asyncWrap(organizationController.getUserOrganizations));
router.get('/:id', asyncWrap(organizationController.getOrganizationById));
router.put('/:id', authenticateToken(["User", "Admin"]), asyncWrap(organizationController.updateOrganization));
router.delete('/:id', authenticateToken(["Admin"]), asyncWrap(organizationController.deleteOrganization));
router.post('/:id/members', authenticateToken(["User", "Admin"]), asyncWrap(organizationController.addMember));
router.delete('/:id/members/:userId', authenticateToken(["User", "Admin"]), asyncWrap(organizationController.removeMember));

export default router;