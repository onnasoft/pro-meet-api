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
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import { OrganizationPlan, OrganizationStatus } from '@/types/organization';
import { buildFindManyOptions, QueryParams } from '@/utils/query';
import { Organization } from '@/entities/Organization';
import { OrganizationMembersService } from '../organization-members/organization-members.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly organizationMembersService: OrganizationMembersService,
  ) {}

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post()
  async create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateOrganizationDto,
  ) {
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
    });

    return organization;
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get()
  async findAll(@Query() query: QueryParams<Organization>) {
    const options = buildFindManyOptions(query);
    return this.organizationsService.findAll(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrganizationDto) {
    return this.organizationsService.update(id, payload);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
