// src/interfaces/organization.interface.ts
export interface CreateOrganizationDto {
  name: string;
  description?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
}

export interface AddMemberDto {
  userId: number;
}