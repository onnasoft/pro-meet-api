import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() payload: CreateTaskDto) {
    return this.tasksService.create({
      title: payload.title,
      description: payload.description,
      key: payload.key,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate,
      estimatedHours: payload.estimatedHours,
      completedAt: payload.completedAt,
      projectId: payload.projectId,
      creatorId: payload.creatorId,
      assigneeId: payload.assigneeId,
    });
  }

  @Get()
  findAndCount() {
    return this.tasksService.findAndCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTaskDto) {
    return this.tasksService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
