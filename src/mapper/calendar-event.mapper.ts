import { formatISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const mapEvent = (event: any, timeZone: string = 'Europe/Istanbul') => ({
  id: event.id,
  title: event.title,
  description: event.description,
  startDate: formatISO(toZonedTime(new Date(event.startDate), timeZone)),
  endDate: formatISO(toZonedTime(new Date(event.endDate), timeZone)),
  eventType: event.eventType,
  availability: event.availability,
  isVisible: event.isVisible,
  attendees: mapAttendees(event.attendees),
});

const mapAttendees = (attendees: any[]) => 
  attendees.map(a => ({
    userId: a.userId,
    firstName: a.user.firstName,
    lastName: a.user.lastName,
    status: a.status,
  }));
