import { Injectable } from '@nestjs/common';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { UpdateTaskLabelDto } from './dto/update-task-label.dto';

@Injectable()
export class TaskLabelsService {
  create(createTaskLabelDto: CreateTaskLabelDto) {
    return 'This action adds a new taskLabel';
  }

  findAll() {
    return `This action returns all taskLabels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskLabel`;
  }

  update(id: number, updateTaskLabelDto: UpdateTaskLabelDto) {
    return `This action updates a #${id} taskLabel`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskLabel`;
  }
}
