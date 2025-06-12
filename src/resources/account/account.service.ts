import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UsersService } from '../users/users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { comparePassword, hashPassword } from '@/utils/secure';

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

  async updatePassword(id: string, payload: UpdatePasswordDto) {
    const hashedPassword = await hashPassword(payload.newPassword);

    const user = await this.usersService
      .findOne({
        select: ['id', 'password'],
        where: { id },
      })
      .catch((error) => {
        throw new InternalServerErrorException(
          'Failed to retrieve user for password update',
          error.message,
        );
      });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const isPasswordValid = await comparePassword(
      payload.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    await this.usersService
      .update(id, {
        password: hashedPassword,
      })
      .catch((error) => {
        throw new InternalServerErrorException(
          'Failed to update password',
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
