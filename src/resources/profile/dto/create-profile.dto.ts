import { ProfileStatus } from '@/types/profile';
import { IsEnum } from 'class-validator';

export class CreateProfileDto {
  @IsEnum(ProfileStatus)
  status: ProfileStatus;
}
