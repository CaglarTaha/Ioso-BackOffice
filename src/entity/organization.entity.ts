// src/entity/organization.entity.ts
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Organization extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany("User", "organizations")
  @JoinTable({
    name: 'organization_members',
    joinColumn: { name: 'organizationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  members: any[];

  @OneToMany("CalendarEvent", "organization")
  events: any[];
}