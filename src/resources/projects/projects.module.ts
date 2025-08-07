import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '@/entities/Project';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from '../organizations/organizations.module';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    OrganizationsModule,
    OrganizationMembersModule,
  ],
})
export class ProjectsModule {}
