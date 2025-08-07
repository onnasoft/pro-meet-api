import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@/entities/Organization';
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
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  create(payload: Create<Organization>) {
    const organization = this.organizationRepository.create(payload);
    return this.organizationRepository.save(organization);
  }

  async findAndCount(options?: FindManyOptions<Organization>) {
    const [organizations, count] =
      await this.organizationRepository.findAndCount(options);

    return pagination({
      data: organizations,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  find(options?: FindManyOptions<Organization>) {
    return this.organizationRepository.find(options);
  }

  findOne(options: FindOneOptions<Organization>) {
    return this.organizationRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Organization>,
    payload: Update<Organization>,
  ): Promise<UpdateResult>;
  update(
    id: string,
    payload: Update<Organization>,
  ): Promise<Organization | null>;
  update(options: any, payload: Update<Organization>) {
    if (typeof options === 'string') {
      return this.organizationRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.organizationRepository.update(options, payload);
  }

  remove(id: string) {
    return this.organizationRepository.delete(id);
  }
}
