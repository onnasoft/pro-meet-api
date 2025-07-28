import { Module } from '@nestjs/common';
import { TaskLabelsService } from './task-labels.service';
import { TaskLabelsController } from './task-labels.controller';

@Module({
  controllers: [TaskLabelsController],
  providers: [TaskLabelsService],
})
export class TaskLabelsModule {}
