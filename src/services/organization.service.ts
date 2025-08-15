// src/services/organization.service.ts
import { AppDataSource } from '../core/data-source';
import { Organization } from '../entity/organization.entity';
import { User } from '../entity/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interfaces/organization.interface';

export class OrganizationService {

  static async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = organizationRepository.create(data);
    return await organizationRepository.save(organization);
  }

  static async getAllOrganizations(): Promise<Organization[]> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    return await organizationRepository.find({
      relations: ['members', 'events']
    });
  }

  static async getOrganizationById(id: number): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    return await organizationRepository.findOne({
      where: { id },
      relations: ['members', 'events']
    });
  }

  static async updateOrganization(id: number, data: UpdateOrganizationDto): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    await organizationRepository.update(id, data);
    return await OrganizationService.getOrganizationById(id);
  }

  static async deleteOrganization(id: number): Promise<boolean> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const result = await organizationRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  static async addMemberToOrganization(organizationId: number, userId: number): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const userRepository = AppDataSource.getRepository(User);
    
    const organization = await organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['members']
    });
    
    if (!organization) return null;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return null;

    if (!organization.members.find(member => member.id === userId)) {
      organization.members.push(user);
      await organizationRepository.save(organization);
    }

    return organization;
  }

  static async removeMemberFromOrganization(organizationId: number, userId: number): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['members']
    });
    
    if (!organization) return null;

    organization.members = organization.members.filter(member => member.id !== userId);
    await organizationRepository.save(organization);

    return organization;
  }

  static async getUserOrganizations(userId: number): Promise<Organization[]> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    return await organizationRepository
    .createQueryBuilder('organization')
     .loadRelationCountAndMap('organization.memberCount', 'organization.members')
     .loadRelationCountAndMap('organization.eventCount', 'organization.events')
    .getMany();
  }
}