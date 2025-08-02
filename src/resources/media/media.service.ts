import { Injectable } from '@nestjs/common';
import { Create, Update } from '@/types/models';
import { Media } from '@/entities/Media';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { pagination } from '@/utils/pagination';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async upload(file: Buffer<ArrayBufferLike>) {
    return {
      filename: '',
      size: file.byteLength,
      mime_type: 'application/octet-stream',
      filesize: file.byteLength,
    };
  }

  create(payload: Create<Media>) {
    const media = this.mediaRepository.create(payload);
    return this.mediaRepository.save(media);
  }

  async findAndCount(options?: FindManyOptions<Media>) {
    const [mediaItems, count] =
      await this.mediaRepository.findAndCount(options);

    return pagination({
      data: mediaItems,
      count,
      skip: options?.skip,
      take: options?.take || 10,
    });
  }

  findOne(options: FindOneOptions<Media>) {
    return this.mediaRepository.findOne(options);
  }

  update(
    options: FindOptionsWhere<Media>,
    payload: Update<Media>,
  ): Promise<UpdateResult>;
  update(id: string, payload: Update<Media>): Promise<Media | null>;
  update(options: FindOptionsWhere<Media> | string, payload: Update<Media>) {
    if (typeof options === 'string') {
      return this.mediaRepository.update(options, payload).then(() => {
        return this.findOne({ where: { id: options } });
      });
    }

    return this.mediaRepository.update(options, payload);
  }

  remove(options: FindOptionsWhere<Media>): Promise<DeleteResult>;
  remove(id: string): Promise<DeleteResult>;
  remove(options: FindOptionsWhere<Media> | string): Promise<DeleteResult> {
    return this.mediaRepository.delete(options);
  }
}
