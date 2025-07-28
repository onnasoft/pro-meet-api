import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from '@/entities/TaskLabel';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';

@Injectable()
export class TaskLabelsService {
  constructor(
    @InjectRepository(TaskLabel)
    private readonly taskLabelRepository: Repository<TaskLabel>,
  ) {}

  create(payload: Create<TaskLabel>) {
    const taskLabel = this.taskLabelRepository.create(payload);
    return this.taskLabelRepository.save(taskLabel);
  }

  async findAll(options?: FindManyOptions<TaskLabel>) {
    const [taskLabels, count] =
      await this.taskLabelRepository.findAndCount(options);

    return pagination({
      data: taskLabels,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<TaskLabel>) {
    return this.taskLabelRepository.findOne(options);
  }

  update(id: string, payload: Update<TaskLabel>) {
    return this.taskLabelRepository.update(id, payload).then(() => {
      return this.findOne({ where: { id } });
    });
  }

  remove(id: string) {
    return this.taskLabelRepository.delete(id);
  }
}
