// src/routes/organization-invites/organization-invite.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { OrganizationInviteController } from '../../controllers/organization-invite/organization-invite.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Davet oluşturma (sadece organizasyon üyeleri)
router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationInviteController.createInvite));

// Davet kodu ile katılma
router.post('/join', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationInviteController.joinByInviteCode));

// Davet kodu bilgilerini alma (public)
router.get('/:inviteCode/info', asyncWrap(OrganizationInviteController.getInviteInfo));

// Organizasyon davetlerini listeleme
router.get('/organization/:organizationId', asyncWrap(OrganizationInviteController.getOrganizationInvites));

// Daveti devre dışı bırakma
router.delete('/:inviteId', authenticateToken(["User", "Admin"]), asyncWrap(OrganizationInviteController.deactivateInvite));

export default router;
