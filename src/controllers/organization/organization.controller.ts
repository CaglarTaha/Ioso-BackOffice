// src/controllers/organization/organization.controller.ts
import { Request, Response } from 'express';
import { OrganizationService } from '../../services/organization.service';
import { createOrganizationSchema, updateOrganizationSchema, addMemberSchema } from '../../validators/organization.validator';
import { AuthenticatedRequest } from '../../interfaces/common.interface';

export class OrganizationController {
  private organizationService = new OrganizationService();

  createOrganization = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { error, value } = createOrganizationSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const organization = await this.organizationService.createOrganization(value);
    
    if (req.user?.id) {
      await this.organizationService.addMemberToOrganization(organization.id, req.user.id);
    }

    res.status(201).json(organization);
    return;
  };

  getAllOrganizations = async (req: Request, res: Response): Promise<void> => {
    const organizations = await this.organizationService.getAllOrganizations();
    res.json(organizations);
    return;
  };

  getOrganizationById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const organization = await this.organizationService.getOrganizationById(id);
    
    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.json(organization);
    return;
  };

  updateOrganization = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { error, value } = updateOrganizationSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const organization = await this.organizationService.updateOrganization(id, value);
    
    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.json(organization);
    return;
  };

  deleteOrganization = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const deleted = await this.organizationService.deleteOrganization(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.status(204).send();
    return;
  };

  addMember = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.id);
    const { error, value } = addMemberSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const organization = await this.organizationService.addMemberToOrganization(organizationId, value.userId);
    
    if (!organization) {
      res.status(404).json({ error: 'Organization or user not found' });
      return;
    }

    res.json(organization);
    return;
  };

  removeMember = async (req: Request, res: Response): Promise<void> => {
    const organizationId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    const organization = await this.organizationService.removeMemberFromOrganization(organizationId, userId);
    
    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.json(organization);
    return;
  };

  getUserOrganizations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const organizations = await this.organizationService.getUserOrganizations(req.user.id);
    res.json(organizations);
    return;
  };
}