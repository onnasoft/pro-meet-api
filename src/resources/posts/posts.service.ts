import { Injectable } from '@nestjs/common';
import { Create, Update } from '@/types/models';
import { Post } from '@/entities/Post';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { pagination } from '@/utils/pagination';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  create(payload: Create<Post>) {
    const post = this.postsRepository.create(payload);
    return this.postsRepository.save(post);
  }

  async findAndCount(options?: FindManyOptions<Post>) {
    const [posts, count] = await this.postsRepository.findAndCount(options);

    return pagination({
      data: posts,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  find(options?: FindManyOptions<Post>) {
    return this.postsRepository.find(options);
  }

  findOne(options: FindOneOptions<Post>) {
    return this.postsRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Post>,
    payload: Update<Post>,
  ): Promise<UpdateResult>;
  update(id: string, payload: Update<Post>): Promise<Post | null>;
  update(options: any, payload: Update<Post>) {
    if (typeof options === 'string') {
      return this.postsRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.postsRepository.update(options, payload);
  }

  remove(id: string) {
    return this.postsRepository.delete(id);
  }
}
