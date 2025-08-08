import { Entity, Column, ManyToOne, Unique, RelationId } from 'typeorm';
import { Base } from './base.entity';
import { CalendarEvent } from './calendar-event.entity';
import { User } from './user.entity';

@Entity()
@Unique(['eventId', 'userId'])
export class CalendarEventAttendee extends Base {
  @ManyToOne(() => CalendarEvent)
  event: CalendarEvent;

  @RelationId((att: CalendarEventAttendee) => att.event)
  @Column()
  eventId: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((att: CalendarEventAttendee) => att.user)
  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: ['going', 'maybe', 'declined'],
    default: 'going',
  })
  status: 'going' | 'maybe' | 'declined';
}


