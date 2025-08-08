// src/core/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { Organization } from '../entity/organization.entity';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { OrganizationInvite } from '../entity/organization-invite.entity';
import { CalendarEventAttendee } from '../entity/calendar-event-attendee.entity';



export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: parseInt(config.database.port, 10),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: false,
  entities: [User, Role, Organization, CalendarEvent, OrganizationInvite, CalendarEventAttendee], // register all entities
  migrations: [],
  subscribers: [],
});
