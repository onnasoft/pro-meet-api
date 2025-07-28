import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMember } from '@/entities/OrganizationMember';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Create, Update } from '@/types/models';
import { pagination } from '@/utils/pagination';

@Injectable()
export class OrganizationMembersService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  create(payload: Create<OrganizationMember>) {
    const organizationMember =
      this.organizationMemberRepository.create(payload);
    return this.organizationMemberRepository.save(organizationMember);
  }

  async findAll(options?: FindManyOptions<OrganizationMember>) {
    const [organizationMembers, count] =
      await this.organizationMemberRepository.findAndCount(options);

    return pagination({
      data: organizationMembers,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<OrganizationMember>) {
    return this.organizationMemberRepository.findOne(options);
  }

  update(id: string, payload: Update<OrganizationMember>) {
    return this.organizationMemberRepository.update(id, payload).then(() => {
      return this.findOne({ where: { id } });
    });
  }

  remove(id: string) {
    return this.organizationMemberRepository.delete(id);
  }
}
