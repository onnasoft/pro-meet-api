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
  UnauthorizedException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { Job } from '@/entities/Job';
import { Language } from '@/utils/language';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { OrganizationMembersService } from '../organization-members/organization-members.service';
import { JobStatus } from '@/types/job';
import { In } from 'typeorm';
import { MemberRole, MemberStatus } from '@/types/organization-member';
import { ProjectsService } from '../projects/projects.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly projectsService: ProjectsService,
    private readonly jobsService: JobsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  async create(
    @Request() req: Express.Request & { user: User },
    @Body() payload: CreateJobDto,
    @I18nLang() lang: Language = 'en',
  ) {
    if (req.user.role !== Role.Admin) {
      const organizationMember = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: payload.organizationId,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['id'],
      });

      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('jobs.not_authorized_to_create_job', { lang }),
        );
      }

      const project = await this.projectsService.findOne({
        where: {
          id: payload.projectId,
          organizationId: payload.organizationId,
        },
        select: ['id'],
      });

      if (!project) {
        throw new BadRequestException(
          this.i18n.translate('jobs.project_not_found', { lang }),
        );
      }
    }

    return this.jobsService.create({
      title: payload.title,
      description: payload.description,
      status: payload.status ?? JobStatus.OPEN,
      contractType: payload.contractType,
      type: payload.type,
      salaryMin: payload.salaryMin,
      salaryMax: payload.salaryMax,
      location: payload.location,
      postedAt: payload.postedAt,
      isActive: payload.isActive,
      recruiterFee: payload.recruiterFee,
      experienceRequired: payload.experienceRequired,
      skillsRequired: payload.skillsRequired,
      benefits: payload.benefits,
      educationLevel: payload.educationLevel,
      organizationId: payload.organizationId,
      projectId: payload.projectId,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('')
  async findAndCount(
    @Request() req: Express.Request & { user: User },
    @Query() query: QueryParams<Job>,
    @I18nLang() lang: Language = 'en',
  ) {
    const options = buildFindManyOptions<Job>(query);
    if (req.user.role !== Role.Admin) {
      options.where ||= {};
      const organizationMember = await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['organizationId'],
      });

      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('jobs.not_authorized_to_create_job', { lang }),
        );
      }

      options.where['organizationId'] = In(
        organizationMember.map((member) => member.organizationId),
      );
    }

    return this.jobsService.findAndCount(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  async findOne(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Query() query: QueryParams<Job>,
    @I18nLang() lang: Language = 'en',
  ) {
    const options = buildFindOneOptions<Job>(query);
    options.where ||= {};
    options.where['id'] = id;

    if (req.user.role !== Role.Admin) {
      const organizationMember = await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['organizationId'],
      });

      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('jobs.not_authorized_to_create_job', { lang }),
        );
      }

      options.where['organizationId'] = In(
        organizationMember.map((member) => member.organizationId),
      );
    }

    return this.jobsService.findOne({
      ...options,
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Patch(':id')
  async update(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Body() payload: UpdateJobDto,
    @I18nLang() lang: Language = 'en',
  ) {
    if (req.user.role !== Role.Admin) {
      const job = await this.jobsService.findOne({
        where: { id },
        select: ['id', 'organizationId', 'projectId'],
      });

      if (!job) {
        throw new BadRequestException(
          this.i18n.translate('jobs.job_not_found', { lang }),
        );
      }

      const organizationMember = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: job.organizationId,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['id'],
      });

      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('jobs.not_authorized_to_update_job', { lang }),
        );
      }

      if (payload.projectId && payload.projectId !== job.projectId) {
        const project = await this.projectsService.findOne({
          where: {
            id: payload.projectId,
            organizationId: job.organizationId,
          },
          select: ['id'],
        });

        if (!project) {
          throw new BadRequestException(
            this.i18n.translate('jobs.project_not_found', { lang }),
          );
        }
      }
    }

    return this.jobsService.update(id, payload);
  }

  @Delete(':id')
  async remove(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @I18nLang() lang: Language = 'en',
  ) {
    if (req.user.role !== Role.Admin) {
      const job = await this.jobsService.findOne({
        where: { id },
        select: ['id', 'organizationId'],
      });

      if (!job) {
        throw new BadRequestException(
          this.i18n.translate('jobs.job_not_found', { lang }),
        );
      }

      const organizationMember = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: job.organizationId,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['id'],
      });

      if (!organizationMember) {
        throw new UnauthorizedException(
          this.i18n.translate('jobs.not_authorized_to_create_job', { lang }),
        );
      }
    }

    return this.jobsService.remove(id);
  }
}
