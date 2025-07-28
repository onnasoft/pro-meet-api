import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskLabelsService } from './task-labels.service';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { UpdateTaskLabelDto } from './dto/update-task-label.dto';

@Controller('task-labels')
export class TaskLabelsController {
  constructor(private readonly taskLabelsService: TaskLabelsService) {}

  @Post()
  create(@Body() createTaskLabelDto: CreateTaskLabelDto) {
    return this.taskLabelsService.create(createTaskLabelDto);
  }

  @Get()
  findAll() {
    return this.taskLabelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskLabelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskLabelDto: UpdateTaskLabelDto) {
    return this.taskLabelsService.update(+id, updateTaskLabelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskLabelsService.remove(+id);
  }
}
