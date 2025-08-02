import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@/entities/Project';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  create(payload: Create<Project>) {
    const project = this.projectsRepository.create(payload);
    return this.projectsRepository.save(project);
  }

  async findAndCount(options?: FindManyOptions<Project>) {
    const [projects, count] =
      await this.projectsRepository.findAndCount(options);

    return pagination({
      data: projects,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<Project>) {
    return this.projectsRepository.findOne(options);
  }

  update(id: string, payload: Update<Project>) {
    return this.projectsRepository.update(id, payload).then(() => {
      return this.findOne({
        where: { id },
      });
    });
  }

  remove(id: string) {
    return this.projectsRepository.delete(id);
  }
}
