// src/services/organization.service.ts
import { CategorizedEvents } from '../calendar-event.types';
import { AppDataSource } from '../core/data-source';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { Organization } from '../entity/organization.entity';
import { User } from '../entity/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interfaces/organization.interface';
import { differenceInCalendarDays, addDays, format, formatISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { mapEvent } from '../mapper/calendar-event.mapper';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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

static async getOrganizationByIdDetail(id: number, timeZone:string = 'Europe/Istanbul', startDate?: string, endDate?: string): Promise<{ categorizedEvents: CategorizedEvents } | null> {
  const organizationRepository = AppDataSource.getRepository(Organization);

const organization = await organizationRepository.findOne({
  where: {
    id,
    events: {
      startDate: startDate ? MoreThanOrEqual(new Date(startDate)) : undefined,
      endDate: endDate ? LessThanOrEqual(new Date(endDate)) : undefined,
    }
  },
  relations: ['events', 'events.attendees', 'events.attendees.user'],
});

  if (!organization) return null;

  const categorizedEvents: CategorizedEvents = {};

  for (const event of organization.events) {
    const start = toZonedTime(new Date(event.startDate), timeZone);
    const end = toZonedTime(new Date(event.endDate), timeZone);

    const daysDiff = differenceInCalendarDays(end, start);

    for (let i = 0; i <= daysDiff; i++) {
      const currentDay = addDays(start, i);
      const dateKey = format(currentDay, 'yyyy-MM-dd');

      if (!categorizedEvents[dateKey]) categorizedEvents[dateKey] = {};

      const dayStart = i === 0 ? start : new Date(currentDay.setHours(0, 0, 0, 0));
      const dayEnd = i === daysDiff ? end : new Date(currentDay.setHours(23, 59, 59, 999));

      let hourCursor = new Date(dayStart);
      while (hourCursor <= dayEnd) {
        const hourKey = format(hourCursor, 'HH:00');
        if (!categorizedEvents[dateKey][hourKey]) categorizedEvents[dateKey][hourKey] = [];

        categorizedEvents[dateKey][hourKey].push(mapEvent(event));

        hourCursor.setHours(hourCursor.getHours() + 1);
      }
    }
  }

  return { categorizedEvents };
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
      .leftJoin('organization.members', 'member')
      .where('member.id = :userId', { userId })
     .loadRelationCountAndMap('organization.memberCount', 'organization.members')
     .loadRelationCountAndMap('organization.eventCount', 'organization.events')
    .getMany();
  }
}