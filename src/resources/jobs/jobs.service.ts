import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '@/entities/Job';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  create(payload: Create<Job>) {
    const job = this.jobsRepository.create(payload);
    return this.jobsRepository.save(job);
  }

  async findAndCount(options?: FindManyOptions<Job>) {
    const [jobs, count] = await this.jobsRepository.findAndCount(options);

    return pagination({
      data: jobs,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  find(options?: FindManyOptions<Job>) {
    return this.jobsRepository.find(options);
  }

  findOne(options: FindOneOptions<Job>) {
    return this.jobsRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Job>,
    payload: Update<Job>,
  ): Promise<UpdateResult>;
  update(id: string, payload: Update<Job>): Promise<Job | null>;
  update(options: any, payload: Update<Job>) {
    if (typeof options === 'string') {
      return this.jobsRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.jobsRepository.update(options, payload);
  }

  remove(id: string) {
    return this.jobsRepository.delete(id);
  }
}
