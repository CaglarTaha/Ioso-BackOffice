// src/routes/organization-invites/organization-invite.routes.ts
import { Router } from 'express';
import asyncWrap from 'express-async-wrap';
import { OrganizationInviteController } from '../../controllers/organization-invite/organization-invite.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const inviteController = new OrganizationInviteController();

// Davet oluşturma (sadece organizasyon üyeleri)
router.post('/', authenticateToken(["User", "Admin"]), asyncWrap(inviteController.createInvite));

// Davet kodu ile katılma
router.post('/join', authenticateToken(["User", "Admin"]), asyncWrap(inviteController.joinByInviteCode));

// Davet kodu bilgilerini alma (public)
router.get('/:inviteCode/info', asyncWrap(inviteController.getInviteInfo));

// Organizasyon davetlerini listeleme
router.get('/organization/:organizationId', asyncWrap(inviteController.getOrganizationInvites));

// Daveti devre dışı bırakma
router.delete('/:inviteId', authenticateToken(["User", "Admin"]), asyncWrap(inviteController.deactivateInvite));

export default router;
