import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccountService {
  constructor(private readonly usersService: UsersService) {}

  findOne(id: string) {
    return this.usersService.findOne({
      select: [
        'id',
        'email',
        'name',
        'language',
        'timezone',
        'newsletter',
        'plan',
        'createdAt',
        'updatedAt',
      ],
      where: { id },
    });
  }

  async update(id: string, payload: UpdateAccountDto) {
    await this.usersService.update(id, payload).catch((error) => {
      throw new InternalServerErrorException(
        'Failed to update account',
        error.message,
      );
    });
    return this.findOne(id).catch((error) => {
      throw new InternalServerErrorException(
        'Failed to retrieve updated account',
        error.message,
      );
    });
  }

  removeMe(id: string) {
    return this.usersService.remove(id).catch((error) => {
      throw new InternalServerErrorException(
        'Failed to delete account',
        error.message,
      );
    });
  }
}
