import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMember } from '@/entities/OrganizationMember';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
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

  async findAndCount(options?: FindManyOptions<OrganizationMember>) {
    const [organizationMembers, count] =
      await this.organizationMemberRepository.findAndCount(options);

    return pagination({
      data: organizationMembers,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  async find(options?: FindManyOptions<OrganizationMember>) {
    return this.organizationMemberRepository.find(options);
  }

  findOne(options: FindOneOptions<OrganizationMember>) {
    return this.organizationMemberRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<OrganizationMember>,
    payload: Update<OrganizationMember>,
  ): Promise<UpdateResult>;
  update(
    id: string,
    payload: Update<OrganizationMember>,
  ): Promise<OrganizationMember | null>;
  update(
    options: FindOptionsWhere<OrganizationMember> | string,
    payload: Update<OrganizationMember>,
  ) {
    if (typeof options === 'string') {
      return this.organizationMemberRepository
        .update(options, payload)
        .then(() => {
          return this.findOne({ where: { id: options } });
        });
    }

    return this.organizationMemberRepository.update(options, payload);
  }

  remove(options: FindOptionsWhere<OrganizationMember>): Promise<DeleteResult>;
  remove(id: string): Promise<DeleteResult>;
  remove(
    options: FindOptionsWhere<OrganizationMember> | string,
  ): Promise<DeleteResult> {
    return this.organizationMemberRepository.delete(options);
  }
}
