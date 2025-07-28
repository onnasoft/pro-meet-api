import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '@/entities/Project';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [TypeOrmModule.forFeature([Project])],
})
export class ProjectsModule {}
