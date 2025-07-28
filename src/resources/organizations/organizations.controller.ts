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
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import { OrganizationPlan, OrganizationStatus } from '@/types/organization';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post()
  create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateOrganizationDto,
  ) {
    return this.organizationsService.create({
      name: payload.name,
      description: payload.description,
      website: payload.website,
      location: payload.location,
      phone: payload.phone,
      logoUrl: payload.logoUrl,
      billingEmail: payload.billingEmail,
      timezone: payload.timezone || 'UTC',
      ownerId: req.user.id,
      isVerified: false,
      plan: OrganizationPlan.FREE,
      status: OrganizationStatus.ACTIVE,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
