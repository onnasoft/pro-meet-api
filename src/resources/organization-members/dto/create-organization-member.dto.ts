import { IsUUID, IsEmail, IsOptional } from 'class-validator';

export class CreateOrganizationMemberDto {
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsEmail()
  email: string;
}
