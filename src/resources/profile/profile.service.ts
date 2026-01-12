import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { pagination } from '@/utils/pagination';
import { Profile } from '@/entities/Profile';
import { InjectRepository } from '@nestjs/typeorm';
import { Create, Update } from '@/types/models';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  create(payload: Create<Profile>) {
    const profile = this.profilesRepository.create(payload);
    return this.profilesRepository.save(profile);
  }

  async findAndCount(options?: FindManyOptions<Profile>) {
    const [profiles, count] =
      await this.profilesRepository.findAndCount(options);

    return pagination({
      data: profiles,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  find(options?: FindManyOptions<Profile>) {
    return this.profilesRepository.find(options);
  }

  findOne(options: FindOneOptions<Profile>) {
    return this.profilesRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Profile>,
    payload: Update<Profile>,
  ): Promise<UpdateResult>;
  update(id: string, payload: Update<Profile>): Promise<Profile | null>;
  update(options: any, payload: Update<Profile>) {
    if (typeof options === 'string') {
      return this.profilesRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.profilesRepository.update(options, payload);
  }

  remove(id: string) {
    return this.profilesRepository.delete(id);
  }
}
