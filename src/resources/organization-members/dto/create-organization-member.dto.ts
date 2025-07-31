import { MemberRole } from '@/types/organization-member';
import { IsUUID, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateOrganizationMemberDto {
  @IsUUID()
  organizationId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn([MemberRole.MEMBER, MemberRole.ADMIN, MemberRole.GUEST])
  @IsNotEmpty()
  role: MemberRole;
}
