import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { User } from '@/entities/User';
import { MemberRole, MemberStatus } from '@/types/organization-member';
import { generateRandomToken, Public } from '@/utils/secure';
import { UsersService } from '../users/users.service';
import { EmailService } from '@/services/email/email.service';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Language } from '@/utils/language';
import { OrganizationsService } from '../organizations/organizations.service';
import { Role } from '@/types/role';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { OrganizationMember } from '@/entities/OrganizationMember';

@Controller('organization-members')
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
  ) {}

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post('invite')
  async create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateOrganizationMemberDto,
    @I18nLang() lang: Language = 'en',
  ) {
    const user = await this.usersService.findOne({
      where: { email: payload.email },
    });

    const inviter = await this.usersService.findOne({
      where: { id: req.user.id },
      select: ['name'],
    });

    if (user && user.id === req.user.id) {
      throw new Error(this.i18n.translate('organizations.invite_self'));
    }

    if (!inviter) {
      throw new Error(this.i18n.translate('organizations.inviter_not_found'));
    }

    const organization = await this.organizationsService.findOne({
      where: { id: payload.organizationId },
      select: ['name'],
    });

    const invitationToken = generateRandomToken();

    await this.emailService.sendOrganizationInviteEmail(payload.email, {
      userName: user?.name || 'New Member',
      token: invitationToken,
      organizationName: organization?.name || 'Unknown Organization',
      existingAccount: !!user,
      inviterName: inviter.name,
      role: payload.role || MemberRole.MEMBER,
      language: lang,
    });

    const member = await this.organizationMembersService.create({
      organizationId: payload.organizationId,
      userId: user?.id ?? null,
      email: payload.email,
      role: payload.role || MemberRole.MEMBER,
      status: MemberStatus.PENDING,
      invitationToken,
      invitationSentAt: new Date(),
    });

    return this.organizationMembersService.findOne({
      where: { id: member.id },
    });
  }

  @Public()
  @Get('')
  async findAll(@Query() query: QueryParams<OrganizationMember>) {
    const options = buildFindManyOptions(query);
    return this.organizationMembersService.findAll(options);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: QueryParams<OrganizationMember>,
  ) {
    const options = buildFindOneOptions(query);
    options.where = { id };

    return this.organizationMembersService.findOne({
      ...options,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationMemberDto,
  ) {
    return this.organizationMembersService.update(id, payload);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationMembersService.remove(id);
  }
}
