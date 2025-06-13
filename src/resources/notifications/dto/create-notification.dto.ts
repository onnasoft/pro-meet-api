import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  metadata: string;
}
