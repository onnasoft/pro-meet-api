import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus, ProjectVisibility } from '@/types/project';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() payload: CreateProjectDto) {
    return this.projectsService.create({
      name: payload.name,
      description: payload.description,
      keyCode: payload.keyCode,
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

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
