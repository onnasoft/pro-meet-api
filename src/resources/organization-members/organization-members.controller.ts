import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { User } from '@/entities/User';
import { MemberRole, MemberStatus } from '@/types/organization-member';
import { generateRandomToken } from '@/utils/secure';

@Controller('organization-members')
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
  ) {}

  @Post()
  create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateOrganizationMemberDto,
  ) {
    return this.organizationMembersService.create({
      organizationId: payload.organizationId,
      userId: req.user.id,
      email: payload.email,
      role: MemberRole.MEMBER,
      status: MemberStatus.PENDING,
      invitationToken: generateRandomToken(),
      invitationSentAt: new Date(),
    });
  }

  @Get()
  findAll() {
    return this.organizationMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationMembersService.findOne({
      where: { id },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationMemberDto,
  ) {
    return this.organizationMembersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationMembersService.remove(id);
  }
}
