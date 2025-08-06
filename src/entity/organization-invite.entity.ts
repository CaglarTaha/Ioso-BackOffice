// src/entity/organization-invite.entity.ts
import { Entity, Column, ManyToOne, RelationId, BeforeInsert } from 'typeorm';
import { Base } from './base.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrganizationInvite extends Base {
  @Column({ unique: true })
  inviteCode: string;

  @Column()
  @RelationId((invite: OrganizationInvite) => invite.organization)
  organizationId: number;

  @ManyToOne("Organization")
  organization: any;

  @Column()
  @RelationId((invite: OrganizationInvite) => invite.createdBy)
  createdById: number;

  @ManyToOne("User")
  createdBy: any;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ nullable: true })
  maxUsage: number;

  @BeforeInsert()
  generateInviteCode() {
    // 8 karakterlik unique kod oluştur
    this.inviteCode = this.generateShortCode();
  }

  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
