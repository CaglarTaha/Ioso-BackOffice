// src/services/calendar-event.service.ts
import { AppDataSource } from '../core/data-source';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { Organization } from '../entity/organization.entity';
import { CalendarEventAttendee } from '../entity/calendar-event-attendee.entity';
import { CreateCalendarEventDto, UpdateCalendarEventDto } from '../interfaces/calendar-event.interface';

export class CalendarEventService {
  private calendarEventRepository = AppDataSource.getRepository(CalendarEvent);
  private organizationRepository = AppDataSource.getRepository(Organization);
  private attendeeRepository = AppDataSource.getRepository(CalendarEventAttendee);

  async createEvent(data: CreateCalendarEventDto, createdById: number): Promise<CalendarEvent | null> {
    const organization = await this.organizationRepository.findOne({
      where: { id: data.organizationId }
    });

    if (!organization) return null;

    // Ensure Date objects for start/end
    const event = this.calendarEventRepository.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdById,
    });

    const saved = await this.calendarEventRepository.save(event);
    // creator becomes attendee (going)
    const attendee = this.attendeeRepository.create({ eventId: saved.id, userId: createdById, status: 'going' });
    await this.attendeeRepository.save(attendee);
    return saved;
  }

  async getEventsByOrganization(organizationId: number): Promise<CalendarEvent[]> {
    return await this.calendarEventRepository.find({
      where: { organizationId },
      relations: ['createdBy', 'organization'],
      order: { startDate: 'ASC' }
    });
  }

  async getEventById(id: number): Promise<CalendarEvent | null> {
    const event = await this.calendarEventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'organization']
    });
    if (!event) return null;
    const attendees = await this.attendeeRepository.find({ where: { eventId: id }, relations: ['user'] });
    (event as any).attendees = attendees.map(a => ({ id: a.userId, status: a.status, user: a.user }));
    return event as any;
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

    // Kullanıcıya göre grupla (id -> events[])
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