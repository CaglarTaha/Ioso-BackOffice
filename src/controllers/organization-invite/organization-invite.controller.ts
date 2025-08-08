// src/controllers/organization-invite/organization-invite.controller.ts
import { Request, Response } from 'express';
import { OrganizationInviteService } from '../../services/organization-invite.service';
import { AuthenticatedRequest } from '../../interfaces/common.interface';
import { validate } from '../../utils/common.utils';
import Joi from 'joi';

const organizationInviteService = new OrganizationInviteService();

export class OrganizationInviteController {

  static async createInvite(req: AuthenticatedRequest, res: Response): Promise<void> {
    const schema = Joi.object({
      organizationId: Joi.number().integer().positive().required(),
      expiresAt: Joi.date().iso().optional(),
      maxUsage: Joi.number().integer().positive().optional()
    });

    const data = validate(req.body, schema);
    const invite = await organizationInviteService.createInvite(data, req.user.id);
    
    if (!invite) {
      res.status(404).json({ error: 'Organizasyon bulunamadı veya yetkiniz yok' });
      return;
    }

    res.status(201).json({
      success: true,
      data: invite,
      message: 'Davet kodu oluşturuldu'
    });
  }

  static async getOrganizationInvites(req: Request, res: Response): Promise<void> {
    const organizationId = parseInt(req.params.organizationId);
    
    if (isNaN(organizationId)) {
      return res.status(400).json({ error: 'Geçersiz organizasyon ID' });
    }

    const invites = await organizationInviteService.getOrganizationInvites(organizationId);
    res.json({
      success: true,
      data: invites
    });
  }

  static async joinByInviteCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    const schema = Joi.object({
      inviteCode: Joi.string().length(8).required()
    });

    const data = validate(req.body, schema);
    const result = await organizationInviteService.joinByInviteCode(data.inviteCode, req.user.id);
    
    if (!result.success) {
      res.status(400).json({ 
        success: false,
        error: result.message 
      });
      return;
    }

    res.json({
      success: true,
      data: result.organization,
      message: result.message
    });
  }

  static async getInviteInfo(req: Request, res: Response): Promise<void> {
    const { inviteCode } = req.params;
    
    if (!inviteCode || inviteCode.length !== 8) {
      return res.status(400).json({ error: 'Geçersiz davet kodu' });
    }

    const invite = await organizationInviteService.getInviteByCode(inviteCode);
    
    if (!invite) {
      res.status(404).json({ error: 'Davet kodu bulunamadı' });
      return;
    }

    const publicInviteInfo = {
      organizationName: invite.organization.name,
      organizationDescription: invite.organization.description,
      createdBy: {
        firstName: invite.createdBy.firstName,
        lastName: invite.createdBy.lastName
      },
      expiresAt: invite.expiresAt,
      isExpired: invite.expiresAt ? invite.expiresAt < new Date() : false,
      isAtLimit: invite.maxUsage ? invite.usageCount >= invite.maxUsage : false
    };

    res.json({
      success: true,
      data: publicInviteInfo
    });
  }

  static async deactivateInvite(req: AuthenticatedRequest, res: Response): Promise<void> {
    const inviteId = parseInt(req.params.inviteId);
    
    if (isNaN(inviteId)) {
      return res.status(400).json({ error: 'Geçersiz davet ID' });
    }

    const result = await organizationInviteService.deactivateInvite(inviteId, req.user.id);
    
    if (!result) {
      res.status(404).json({ error: 'Davet bulunamadı veya yetkiniz yok' });
      return;
    }

    res.json({
      success: true,
      message: 'Davet kodu devre dışı bırakıldı'
    });
  }
}
