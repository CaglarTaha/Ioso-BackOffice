// src/entity/calendar-event.entity.ts
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class CalendarEvent extends Base {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ 
    type: 'enum', 
    enum: ['personal', 'meeting', 'event'], 
    default: 'personal' 
  })
  eventType: 'personal' | 'meeting' | 'event';

  @Column({ 
    type: 'enum', 
    enum: ['busy', 'free', 'tentative'], 
    default: 'busy' 
  })
  availability: 'busy' | 'free' | 'tentative';

  @Column({ default: true })
  isVisible: boolean;

  @Column()
  @RelationId((event: CalendarEvent) => event.organization)
  organizationId: number;

  @ManyToOne("Organization", "events")
  organization: any;

  @Column()
  @RelationId((event: CalendarEvent) => event.createdBy)
  createdById: number;

  @ManyToOne("User")
  createdBy: any;
}