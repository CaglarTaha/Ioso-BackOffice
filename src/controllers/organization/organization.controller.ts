// src/controllers/organization/organization.controller.ts
import { Request, Response } from 'express';
import { OrganizationService } from '../../services/organization.service';
import { createOrganizationSchema, updateOrganizationSchema, addMemberSchema } from '../../validators/organization.validator';
import { AuthenticatedRequest } from '../../interfaces/common.interface';
import { validate } from '../../utils/common.utils';

export class OrganizationController {

  static async createOrganization(req: AuthenticatedRequest, res: Response) {
    const data = validate(req.body, createOrganizationSchema);
    const organization = await OrganizationService.createOrganization(data);
    
    if (req.user?.id) {
      await OrganizationService.addMemberToOrganization(organization.id, req.user.id);
    }

    res.status(201).json({ data: organization });
  }

  static async getAllOrganizations(req: Request, res: Response) {
    const organizations = await OrganizationService.getAllOrganizations();
    res.json({ data: organizations });
  }

  static async getOrganizationById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const organization = await OrganizationService.getOrganizationById(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ data: organization });
  }

  static async updateOrganization(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = validate(req.body, updateOrganizationSchema);
    const organization = await OrganizationService.updateOrganization(id, data);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ data: organization });
  }

  static async deleteOrganization(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const deleted = await OrganizationService.deleteOrganization(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(204).send();
  }

  static async addMember(req: Request, res: Response) {
    const organizationId = parseInt(req.params.id);
    const data = validate(req.body, addMemberSchema);
    const organization = await OrganizationService.addMemberToOrganization(organizationId, data.userId);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization or user not found' });
    }

    res.json({ data: organization });
  }

  static async removeMember(req: Request, res: Response) {
    const organizationId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const organization = await OrganizationService.removeMemberFromOrganization(organizationId, userId);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ data: organization });
  }

  static async getUserOrganizations(req: AuthenticatedRequest, res: Response) {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'User not authenticated' });
    }
    const organizations = await OrganizationService.getUserOrganizations(req.user.id);
    res.json({ data: organizations });
  }
}