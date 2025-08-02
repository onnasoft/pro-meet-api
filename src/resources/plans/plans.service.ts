import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';
import { Plan } from '@/entities/Plan';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  create(payload: Create<Plan>) {
    const plan = this.planRepository.create(payload);
    return this.planRepository.save(plan);
  }

  async findAndCount(options?: FindManyOptions<Plan>) {
    const [plans, count] = await this.planRepository.findAndCount(options);

    return pagination({
      data: plans,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<Plan>) {
    return this.planRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Plan>,
    payload: Update<Plan>,
  ): Promise<UpdateResult>;
  update(id: string, payload: Update<Plan>): Promise<Plan | null>;
  update(options: any, payload: Update<Plan>) {
    if (typeof options === 'string') {
      return this.planRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.planRepository.update(options, payload);
  }

  remove(id: string) {
    return this.planRepository.delete(id);
  }
}
