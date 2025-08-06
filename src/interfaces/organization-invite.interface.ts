// src/interfaces/organization-invite.interface.ts
export interface CreateInviteDto {
  organizationId: number;
  expiresAt?: Date;
  maxUsage?: number;
}

export interface JoinByInviteDto {
  inviteCode: string;
}

export interface InviteResponse {
  id: number;
  inviteCode: string;
  organizationId: number;
  organizationName: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
  expiresAt: Date | null;
  isActive: boolean;
  usageCount: number;
  maxUsage: number | null;
  createdAt: Date;
}
