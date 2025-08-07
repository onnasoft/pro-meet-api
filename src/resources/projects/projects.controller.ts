import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus, ProjectVisibility } from '@/types/project';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Role } from '@/types/role';
import { generateRandomToken } from '@/utils/secure';
import { OrganizationsService } from '../organizations/organizations.service';
import { OrganizationMembersService } from '../organization-members/organization-members.service';
import { MemberRole } from '@/types/organization-member';
import { Request } from 'express';
import { User } from '@/entities/User';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly organizationsService: OrganizationsService,
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly i18n: I18nService,
  ) {}

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Post()
  async create(
    @Req() req: Request & { user: User },
    @Body() payload: CreateProjectDto,
    @I18nLang() lang: string,
  ) {
    if (req.user.role !== Role.Admin) {
      const organization = await this.organizationsService.findOne({
        where: { id: payload.organizationId },
      });

      if (!organization) {
        throw new BadRequestException(
          this.i18n.translate('organizations.organization_not_found', { lang }),
        );
      }

      const organizationMember = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: organization.id,
        },
      });

      if (!organizationMember) {
        throw new BadRequestException(
          this.i18n.translate('organizations.member_not_found', { lang }),
        );
      }

      const organizationRole = organizationMember?.role;
      const allowedRoles = [
        MemberRole.OWNER,
        MemberRole.ADMIN,
        MemberRole.MEMBER,
      ];
      if (!allowedRoles.includes(organizationRole)) {
        throw new BadRequestException(
          this.i18n.translate('organizations.invalid_permission', {
            lang,
          }),
        );
      }
    }

    return this.projectsService.create({
      name: payload.name,
      description: payload.description,
      keyCode: payload.keyCode || generateRandomToken(10).substring(0, 10),
      status: ProjectStatus.PLANNING,
      visibility: ProjectVisibility.TEAM,
      startDate: payload.startDate,
      dueDate: payload.dueDate,
      logoUrl: payload.logoUrl,
      isTemplate: payload.isTemplate,
      organizationId: payload.organizationId,
      leaderId: payload.leaderId,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get()
  findAndCount() {
    return this.projectsService.findAndCount();
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne({ where: { id } });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
