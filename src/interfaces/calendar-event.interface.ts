// src/interfaces/calendar-event.interface.ts
export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  organizationId: number;
  eventType?: 'personal' | 'meeting' | 'event';
  availability?: 'busy' | 'free' | 'tentative';
  isVisible?: boolean;
}

export interface UpdateCalendarEventDto {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  eventType?: 'personal' | 'meeting' | 'event';
  availability?: 'busy' | 'free' | 'tentative';
  isVisible?: boolean;
}