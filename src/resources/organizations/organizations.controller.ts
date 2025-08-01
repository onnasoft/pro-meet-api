import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import { OrganizationPlan, OrganizationStatus } from '@/types/organization';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { Organization } from '@/entities/Organization';
import { OrganizationMembersService } from '../organization-members/organization-members.service';
import { MemberRole, MemberStatus } from '@/types/organization-member';
import { StripeService } from '../stripe/stripe.service';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { PlansService } from '../plans/plans.service';
import { Language } from '@/utils/language';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly stripeService: StripeService,
    private readonly plansService: PlansService,
    private readonly i18n: I18nService,
  ) {}

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post()
  async create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateOrganizationDto,
    @I18nLang() lang: string,
  ) {
    const existingOrganization = await this.organizationsService.findOne({
      where: { ownerId: req.user.id },
    });

    if (existingOrganization) {
      throw new BadRequestException(
        this.i18n.translate('organizations.already_exists', {
          lang,
        }),
      );
    }

    const plan = await this.plansService.findOne({
      where: { name: payload.plan.toUpperCase() },
    });

    if (!plan) {
      throw new BadRequestException(
        this.i18n.translate('organizations.plan_not_found', {
          lang,
          args: { plan: payload.plan },
        }),
      );
    }

    await this.stripeService.subscribeToPlan(req.user.id, plan.id);

    const organization = await this.organizationsService.create({
      name: payload.name,
      description: payload.description,
      website: payload.website,
      location: payload.location,
      phone: payload.phone,
      logoUrl: payload.logoUrl,
      billingEmail: req.user.email,
      ownerId: req.user.id,
      isVerified: false,
      plan: payload.plan || OrganizationPlan.FREE,
      status: OrganizationStatus.ACTIVE,
      current: true,
    });

    await this.organizationMembersService.create({
      userId: req.user.id,
      organizationId: organization.id,
      role: MemberRole.OWNER,
      email: req.user.email,
      status: MemberStatus.ACTIVE,
      invitationSentAt: null,
      invitationToken: null,
    });

    return organization;
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('')
  async findAndCount(
    @Request() req: Express.Request & { user: User },
    @Query() query: QueryParams<Organization>,
  ) {
    const options = buildFindManyOptions<Organization>(query);
    if (req.user.role !== Role.Admin) {
      options.where ||= {};
      options.where['members'] ||= {};
      options.where['members']['userId'] = req.user.id;
    }

    return this.organizationsService.findAndCount(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: QueryParams<Organization>) {
    const options = buildFindOneOptions<Organization>(query);
    options.where = {
      id,
      ...(options.where || {}),
    };

    return this.organizationsService.findOne({
      ...options,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  async update(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationDto,
    @I18nLang() lang: Language = 'en',
  ) {
    const { current } = payload;

    if (req.user.role !== Role.Admin) {
      const organization = await this.organizationsService.findOne({
        where: { id },
      });

      if (!organization) {
        throw new BadRequestException(
          this.i18n.translate('organizations.organization_not_found', { lang }),
        );
      }

      const organizationMember = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: id,
        },
      });

      if (!organizationMember) {
        throw new BadRequestException(
          this.i18n.translate('organizations.member_not_found', { lang }),
        );
      }

      const organizationRole = organizationMember?.role;

      if (![MemberRole.OWNER, MemberRole.ADMIN].includes(organizationRole)) {
        throw new BadRequestException(
          this.i18n.translate('organizations.invalid_permission', {
            lang,
          }),
        );
      }
    }

    if (current) {
      await this.organizationsService.update(
        { ownerId: req.user.id, current: true },
        { current: false },
      );
    }

    return this.organizationsService.update(id, payload);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
