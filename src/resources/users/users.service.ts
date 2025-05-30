import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/User';
import { FindOneOptions, Repository, IsNull } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findAll(options?: FindOneOptions<User>) {
    return this.userRepository.find(
      options || {
        where: { deletedAt: IsNull() },
        select: ['id', 'name', 'email'],
        order: { createdAt: 'DESC' },
        take: 100,
      },
    );
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}
