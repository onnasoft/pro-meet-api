import { OrganizationPlan } from '@/types/organization';
import { IsPhoneNumberOrEmpty, IsUrlOrEmpty } from '@/utils/validation';
import {
  IsString,
  IsOptional,
  Length,
  IsEnum,
  IsEmail,
  IsArray,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  @IsUrlOrEmpty()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsEnum(OrganizationPlan)
  plan: OrganizationPlan;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  members: string[];
}
