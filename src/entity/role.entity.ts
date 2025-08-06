// src/entity/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Role extends Base {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @BeforeInsert()
  @BeforeUpdate()
  formatName() {
    if (this.name) {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    }
  }
}
