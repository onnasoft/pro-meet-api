import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskLabelsService } from './task-labels.service';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { UpdateTaskLabelDto } from './dto/update-task-label.dto';

@Controller('task-labels')
export class TaskLabelsController {
  constructor(private readonly taskLabelsService: TaskLabelsService) {}

  @Post()
  create(@Body() payload: CreateTaskLabelDto) {
    return this.taskLabelsService.create({
      name: payload.name,
      color: payload.color,
      description: payload.description,
      organizationId: payload.organizationId,
    });
  }

  @Get()
  findAll() {
    return this.taskLabelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskLabelsService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTaskLabelDto) {
    return this.taskLabelsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskLabelsService.remove(id);
  }
}
