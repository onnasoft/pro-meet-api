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
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { User } from '@/entities/User';
import {
  MemberRole,
  MemberStatus,
  MemberStatusMachine,
} from '@/types/organization-member';
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
import { FindOptionsWhere, In, IsNull, Not } from 'typeorm';

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
      where: { email: req.user.email },
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

    if (!organization) {
      throw new BadRequestException(
        this.i18n.translate('organizations.organization_not_found', {
          lang,
          args: { organizationId: payload.organizationId },
        }),
      );
    }

    const existingInvitation = await this.organizationMembersService.findOne({
      where: {
        organizationId: payload.organizationId,
        email: payload.email,
        status: In([MemberStatus.PENDING, MemberStatus.ACTIVE]),
      },
    });

    if (existingInvitation) {
      throw new BadRequestException(
        this.i18n.translate('organizations.invitation_already_exists', {
          lang,
          args: { email: payload.email },
        }),
      );
    }

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
  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('')
  async findAll(
    @Request() req: Express.Request & { user?: User },
    @Query() query: QueryParams<OrganizationMember>,
    @I18nLang() lang: Language = 'en',
  ) {
    const options = buildFindManyOptions(query);
    if (req.user?.role === Role.Admin) {
      // Admins can see all members
    } else if (req.user?.id) {
      options.where ||= {};
      options.where['email'] = req.user.email;

      const condition = { email: req.user.email || '', userId: IsNull() };
      await this.organizationMembersService.update(condition, {
        userId: req.user.id,
      });
    } else if (!options.where || !options.where['invitationToken']) {
      throw new UnauthorizedException(
        this.i18n.translate('organizations.invitation_required', { lang }),
      );
    }

    return this.organizationMembersService.findAll(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Public()
  @Get(':id')
  findOne(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Query() query: QueryParams<OrganizationMember>,
  ) {
    const options = buildFindOneOptions(query);
    options.where = { id };
    if (req.user.role !== Role.Admin) {
      options.where['email'] = req.user.email;
    }

    return this.organizationMembersService.findOne({
      ...options,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  async update(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationMemberDto,
    @I18nLang() lang: Language = 'en',
  ) {
    if (req.user.role !== Role.Admin) {
      const organizationMember = await this.organizationMembersService.findOne({
        where: { id, email: req.user.email },
      });
      const condition = { id, email: req.user.email };
      if (payload.status) {
        const mc = new MemberStatusMachine(
          organizationMember?.status as MemberStatus,
        );
        if (!mc.canTransition(payload.status)) {
          throw new BadRequestException(
            this.i18n.translate('organizations.invalid_status_transition', {
              lang,
            }),
          );
        }
      }

      return this.organizationMembersService.update(condition, payload);
    }
    return this.organizationMembersService.update(id, payload);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  async remove(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @I18nLang() lang: Language = 'en',
  ) {
    if (req.user.role !== Role.Admin) {
      const organizationMember = await this.organizationMembersService.findOne({
        where: { id, email: req.user.email },
        relations: ['organization', 'organization.owner'],
      });
      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('organizations.member_not_found', { lang }),
        );
      }

      const condition: FindOptionsWhere<OrganizationMember> = {
        id,
        email: In([
          req.user.email,
          organizationMember.organization?.owner.email,
        ]),
        role: Not(MemberRole.OWNER),
      };
      const status =
        req.user.email === organizationMember.organization?.owner.email
          ? MemberStatus.CANCELED
          : MemberStatus.REJECTED;

      return this.organizationMembersService.update(condition, {
        status,
      });
    }
    return this.organizationMembersService.remove(id);
  }
}
