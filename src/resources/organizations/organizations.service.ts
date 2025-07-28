import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@/entities/Organization';
import { FindManyOptions, Repository } from 'typeorm';
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

  async findAll(options?: FindManyOptions<Organization>) {
    const [organizations, count] =
      await this.organizationRepository.findAndCount(options);

    return pagination({
      data: organizations,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(id: string) {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['members', 'projects', 'taskLabels'],
    });
  }

  update(id: string, payload: Update<Organization>) {
    return this.organizationRepository.update(id, payload).then(() => {
      return this.findOne(id);
    });
  }

  remove(id: string) {
    return this.organizationRepository.delete(id);
  }
}
