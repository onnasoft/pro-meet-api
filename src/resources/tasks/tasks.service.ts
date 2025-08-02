import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '@/entities/Task';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  create(payload: Create<Task>) {
    const task = this.tasksRepository.create(payload);
    return this.tasksRepository.save(task);
  }

  async findAndCount(options?: FindManyOptions<Task>) {
    const [tasks, count] = await this.tasksRepository.findAndCount(options);

    return pagination({
      data: tasks,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<Task>) {
    return this.tasksRepository.findOne(options);
  }

  update(id: string, payload: Update<Task>) {
    return this.tasksRepository.update(id, payload).then(() => {
      return this.findOne({ where: { id } });
    });
  }

  remove(id: string) {
    return this.tasksRepository.delete(id);
  }
}
