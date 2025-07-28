import { Module } from '@nestjs/common';
import { TaskLabelsService } from './task-labels.service';
import { TaskLabelsController } from './task-labels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLabel } from '@/entities/TaskLabel';

@Module({
  controllers: [TaskLabelsController],
  providers: [TaskLabelsService],
  imports: [TypeOrmModule.forFeature([TaskLabel])],
})
export class TaskLabelsModule {}
