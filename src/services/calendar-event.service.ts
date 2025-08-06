// src/services/calendar-event.service.ts
import { AppDataSource } from '../core/data-source';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { Organization } from '../entity/organization.entity';
import { CreateCalendarEventDto, UpdateCalendarEventDto } from '../interfaces/calendar-event.interface';

export class CalendarEventService {
  private calendarEventRepository = AppDataSource.getRepository(CalendarEvent);
  private organizationRepository = AppDataSource.getRepository(Organization);

  async createEvent(data: CreateCalendarEventDto, createdById: number): Promise<CalendarEvent | null> {
    const organization = await this.organizationRepository.findOne({
      where: { id: data.organizationId }
    });

    if (!organization) return null;

    const event = this.calendarEventRepository.create({
      ...data,
      createdById
    });

    return await this.calendarEventRepository.save(event);
  }

  async getEventsByOrganization(organizationId: number): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository.find({
      where: { organizationId },
      relations: ['createdBy', 'organization'],
      order: { startDate: 'ASC' }
    });
  }

  async getEventById(id: number): Promise<CalendarEvent | null> {
    return await this.calendarEventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'organization']
    });
  }

  async updateEvent(id: number, data: UpdateCalendarEventDto): Promise<CalendarEvent | null> {
    await this.calendarEventRepository.update(id, data);
    return await this.getEventById(id);
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await this.calendarEventRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getEventsByDateRange(organizationId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository
      .createQueryBuilder('event')
      .where('event.organizationId = :organizationId', { organizationId })
      .andWhere('event.startDate >= :startDate', { startDate })
      .andWhere('event.endDate <= :endDate', { endDate })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  async getUserEvents(userId: number): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoin('event.organization', 'organization')
      .leftJoin('organization.members', 'member')
      .where('member.id = :userId', { userId })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .leftJoinAndSelect('event.organization', 'org')
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  // Yeni özellikler: Google Calendar benzeri fonksiyonlar
  async checkUserAvailability(userId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoin('event.organization', 'organization')
      .leftJoin('organization.members', 'member')
      .where('member.id = :userId', { userId })
      .andWhere('event.availability = :availability', { availability: 'busy' })
      .andWhere('event.startDate < :endDate', { endDate })
      .andWhere('event.endDate > :startDate', { startDate })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .getMany();
  }

  async getOrganizationCalendarView(organizationId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository
      .createQueryBuilder('event')
      .where('event.organizationId = :organizationId', { organizationId })
      .andWhere('event.isVisible = :isVisible', { isVisible: true })
      .andWhere('event.startDate >= :startDate', { startDate })
      .andWhere('event.endDate <= :endDate', { endDate })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  async getAllMembersEvents(organizationId: number, startDate: Date, endDate: Date): Promise<{[key: string]: CalendarEvent[]}> {
    const events = await this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoin('event.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('event.isVisible = :isVisible', { isVisible: true })
      .andWhere('event.startDate >= :startDate', { startDate })
      .andWhere('event.endDate <= :endDate', { endDate })
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .orderBy('event.startDate', 'ASC')
      .getMany();

    // Kullanıcıya göre grupla
    const groupedEvents: {[key: string]: CalendarEvent[]} = {};
    events.forEach(event => {
      const userId = event.createdById.toString();
      if (!groupedEvents[userId]) {
        groupedEvents[userId] = [];
      }
      groupedEvents[userId].push(event);
    });

    return groupedEvents;
  }

  async findTimeSlots(organizationId: number, duration: number, startDate: Date, endDate: Date): Promise<{start: Date, end: Date}[]> {
    // Organizasyondaki tüm busy eventleri al
    const busyEvents = await this.calendarEventRepository
      .createQueryBuilder('event')
      .where('event.organizationId = :organizationId', { organizationId })
      .andWhere('event.availability = :availability', { availability: 'busy' })
      .andWhere('event.startDate >= :startDate', { startDate })
      .andWhere('event.endDate <= :endDate', { endDate })
      .orderBy('event.startDate', 'ASC')
      .getMany();

    // Boş zaman dilimlerini hesapla
    const freeSlots: {start: Date, end: Date}[] = [];
    let currentTime = new Date(startDate);

    for (const event of busyEvents) {
      if (currentTime < event.startDate) {
        const slotDuration = event.startDate.getTime() - currentTime.getTime();
        if (slotDuration >= duration * 60000) { // duration dakika cinsinden
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(event.startDate)
          });
        }
      }
      currentTime = new Date(Math.max(currentTime.getTime(), event.endDate.getTime()));
    }

    // Son event'ten endDate'e kadar olan süreyi kontrol et
    if (currentTime < endDate) {
      const slotDuration = endDate.getTime() - currentTime.getTime();
      if (slotDuration >= duration * 60000) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(endDate)
        });
      }
    }

    return freeSlots;
  }
}