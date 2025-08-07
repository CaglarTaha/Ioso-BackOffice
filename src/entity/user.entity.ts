// src/entity/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, ManyToOne, RelationId, ManyToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Base } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  @RelationId((user: User) => user.role)
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @ManyToMany("Organization", "members")
  organizations: any[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
