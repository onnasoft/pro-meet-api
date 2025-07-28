import { OrganizationPlan } from '@/types/organization';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsPhoneNumber,
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
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsUrl()
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
