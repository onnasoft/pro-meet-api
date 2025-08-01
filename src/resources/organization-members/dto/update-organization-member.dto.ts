import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationMemberDto } from './create-organization-member.dto';
import { MemberStatus } from '@/types/organization-member';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateOrganizationMemberDto extends PartialType(
  CreateOrganizationMemberDto,
) {
  @IsOptional()
  @IsIn([
    MemberStatus.PENDING,
    MemberStatus.ACTIVE,
    MemberStatus.REJECTED,
    MemberStatus.CANCELED,
    MemberStatus.DELETED,
  ])
  status?: MemberStatus;
}
