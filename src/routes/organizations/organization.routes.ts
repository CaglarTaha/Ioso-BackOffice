// src/routes/organizations/organization.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { OrganizationController } from '../../controllers/organization/organization.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationInput'
 *     responses:
 *       201:
 *         description: Organization created successfully
 */
router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationController.createOrganization));
/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organization]
 *     responses:
 *       200:
 *         description: Organizations list
 */
router.get('/', asyncWrap(OrganizationController.getAllOrganizations));
router.get('/my', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationController.getUserOrganizations));
/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organization found
 *       404:
 *         description: Organization not found
 */
router.get('/:id', asyncWrap(OrganizationController.getOrganizationById));
router.put('/:id', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationController.updateOrganization));
/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete organization by ID
 *     tags: [Organization]
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
 *         description: Organization deleted successfully
 */
router.delete('/:id', authenticateToken(["Admin"]), asyncWrap(OrganizationController.deleteOrganization));
router.post('/:id/members', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationController.addMember));
router.delete('/:id/members/:userId', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationController.removeMember));

export default router;