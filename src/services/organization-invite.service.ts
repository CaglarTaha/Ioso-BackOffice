// src/services/organization-invite.service.ts
import { AppDataSource } from '../core/data-source';
import { OrganizationInvite } from '../entity/organization-invite.entity';
import { Organization } from '../entity/organization.entity';
import { User } from '../entity/user.entity';
import { CreateInviteDto, JoinByInviteDto } from '../interfaces/organization-invite.interface';

export class OrganizationInviteService {
  private inviteRepository = AppDataSource.getRepository(OrganizationInvite);
  private organizationRepository = AppDataSource.getRepository(Organization);
  private userRepository = AppDataSource.getRepository(User);

  async createInvite(data: CreateInviteDto, createdById: number): Promise<OrganizationInvite | null> {
    // Organizasyonun var olduğunu kontrol et
    const organization = await this.organizationRepository.findOne({
      where: { id: data.organizationId }
    });

    if (!organization) return null;

    // Kullanıcının organizasyonun üyesi olduğunu kontrol et
    const userOrganization = await this.organizationRepository
      .createQueryBuilder('org')
      .leftJoin('org.members', 'member')
      .where('org.id = :organizationId', { organizationId: data.organizationId })
      .andWhere('member.id = :userId', { userId: createdById })
      .getOne();

    if (!userOrganization) return null;

    const invite = this.inviteRepository.create({
      ...data,
      createdById
    });

    return await this.inviteRepository.save(invite);
  }

  async getOrganizationInvites(organizationId: number): Promise<OrganizationInvite[]> {
    return await this.inviteRepository.find({
      where: { organizationId, isActive: true },
      relations: ['createdBy', 'organization'],
      order: { createDate: 'DESC' }
    });
  }

  async joinByInviteCode(inviteCode: string, userId: number): Promise<{ success: boolean; message: string; organization?: Organization }> {
    // Invite kodunu bul
    const invite = await this.inviteRepository.findOne({
      where: { inviteCode, isActive: true },
      relations: ['organization']
    });

    if (!invite) {
      return { success: false, message: 'Geçersiz davet kodu' };
    }

    // Süre kontrolü
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return { success: false, message: 'Davet kodunun süresi dolmuş' };
    }

    // Kullanım limiti kontrolü
    if (invite.maxUsage && invite.usageCount >= invite.maxUsage) {
      return { success: false, message: 'Davet kodunun kullanım limiti dolmuş' };
    }

    // User'ın zaten üye olup olmadığını kontrol et
    const existingMember = await this.organizationRepository
      .createQueryBuilder('org')
      .leftJoin('org.members', 'member')
      .where('org.id = :organizationId', { organizationId: invite.organizationId })
      .andWhere('member.id = :userId', { userId })
      .getOne();

    if (existingMember) {
      return { success: false, message: 'Zaten bu organizasyonun üyesisiniz' };
    }

    // User'ı organizasyona ekle
    const organization = await this.organizationRepository.findOne({
      where: { id: invite.organizationId },
      relations: ['members']
    });

    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!organization || !user) {
      return { success: false, message: 'Organizasyon veya kullanıcı bulunamadı' };
    }

    // Üyeliği ekle
    if (!organization.members) {
      organization.members = [];
    }
    organization.members.push(user);
    await this.organizationRepository.save(organization);

    // Invite kullanım sayısını artır
    invite.usageCount += 1;
    await this.inviteRepository.save(invite);

    return { 
      success: true, 
      message: 'Organizasyona başarıyla katıldınız', 
      organization 
    };
  }

  async deactivateInvite(inviteId: number, userId: number): Promise<boolean> {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId, createdById: userId, isActive: true }
    });

    if (!invite) return false;

    invite.isActive = false;
    await this.inviteRepository.save(invite);
    return true;
  }

  async getInviteByCode(inviteCode: string): Promise<OrganizationInvite | null> {
    return await this.inviteRepository.findOne({
      where: { inviteCode, isActive: true },
      relations: ['organization', 'createdBy']
    });
  }
}
