// src/services/organization.service.ts
import { AppDataSource } from '../core/data-source';
import { Organization } from '../entity/organization.entity';
import { User } from '../entity/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interfaces/organization.interface';

export class OrganizationService {
  private organizationRepository = AppDataSource.getRepository(Organization);
  private userRepository = AppDataSource.getRepository(User);

  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationRepository.create(data);
    return await this.organizationRepository.save(organization);
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await this.organizationRepository.find({
      relations: ['members', 'events']
    });
  }

  async getOrganizationById(id: number): Promise<Organization | null> {
    return await this.organizationRepository.findOne({
      where: { id },
      relations: ['members', 'events']
    });
  }

  async updateOrganization(id: number, data: UpdateOrganizationDto): Promise<Organization | null> {
    await this.organizationRepository.update(id, data);
    return await this.getOrganizationById(id);
  }

  async deleteOrganization(id: number): Promise<boolean> {
    const result = await this.organizationRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async addMemberToOrganization(organizationId: number, userId: number): Promise<Organization | null> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['members']
    });
    
    if (!organization) return null;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return null;

    if (!organization.members.find(member => member.id === userId)) {
      organization.members.push(user);
      await this.organizationRepository.save(organization);
    }

    return organization;
  }

  async removeMemberFromOrganization(organizationId: number, userId: number): Promise<Organization | null> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['members']
    });
    
    if (!organization) return null;

    organization.members = organization.members.filter(member => member.id !== userId);
    await this.organizationRepository.save(organization);

    return organization;
  }

  async getUserOrganizations(userId: number): Promise<Organization[]> {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoin('organization.members', 'member')
      .where('member.id = :userId', { userId })
      .getMany();
  }
}