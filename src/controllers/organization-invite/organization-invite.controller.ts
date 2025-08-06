// src/controllers/organization-invite/organization-invite.controller.ts
import { Request, Response } from 'express';
import { OrganizationInviteService } from '../../services/organization-invite.service';
import { AuthenticatedRequest } from '../../interfaces/common.interface';
import Joi from 'joi';

export class OrganizationInviteController {
  private inviteService = new OrganizationInviteService();

  createInvite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const schema = Joi.object({
      organizationId: Joi.number().integer().positive().required(),
      expiresAt: Joi.date().iso().optional(),
      maxUsage: Joi.number().integer().positive().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const invite = await this.inviteService.createInvite(value, req.user.id);
    
    if (!invite) {
      res.status(404).json({ error: 'Organizasyon bulunamadı veya yetkiniz yok' });
      return;
    }

    res.status(201).json({
      success: true,
      data: invite,
      message: 'Davet kodu oluşturuldu'
    });
  };

  getOrganizationInvites = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.organizationId);
    
    if (isNaN(organizationId)) {
      res.status(400).json({ error: 'Geçersiz organizasyon ID' });
      return;
    }

    const invites = await this.inviteService.getOrganizationInvites(organizationId);
    res.json({
      success: true,
      data: invites
    });
  };

  joinByInviteCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const schema = Joi.object({
      inviteCode: Joi.string().length(8).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const result = await this.inviteService.joinByInviteCode(value.inviteCode, req.user.id);
    
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
  };

  getInviteInfo = async (req: Request, res: Response): Promise<void> => {
    const { inviteCode } = req.params;
    
    if (!inviteCode || inviteCode.length !== 8) {
      res.status(400).json({ error: 'Geçersiz davet kodu' });
      return;
    }

    const invite = await this.inviteService.getInviteByCode(inviteCode);
    
    if (!invite) {
      res.status(404).json({ error: 'Davet kodu bulunamadı' });
      return;
    }

    // Hassas bilgileri gizle
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
  };

  deactivateInvite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const inviteId = parseInt(req.params.inviteId);
    
    if (isNaN(inviteId)) {
      res.status(400).json({ error: 'Geçersiz davet ID' });
      return;
    }

    const result = await this.inviteService.deactivateInvite(inviteId, req.user.id);
    
    if (!result) {
      res.status(404).json({ error: 'Davet bulunamadı veya yetkiniz yok' });
      return;
    }

    res.json({
      success: true,
      message: 'Davet kodu devre dışı bırakıldı'
    });
  };
}
