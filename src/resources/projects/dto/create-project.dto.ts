import { IsPhoneNumberOrEmpty, IsUrlOrEmpty } from '@/utils/validation';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  keyCode: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  startDate?: Date | null;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  dueDate?: Date | null;

  @IsOptional()
  @IsUrlOrEmpty()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsPhoneNumberOrEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? Boolean(value) : false))
  isTemplate: boolean;

  @IsUUID()
  organizationId: string;

  @IsUUID()
  leaderId: string;
}
