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
  keyCode: string;

  @IsOptional()
  @IsDate()
  startDate?: Date | null;

  @IsOptional()
  @IsDate()
  dueDate?: Date | null;

  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isTemplate: boolean;

  @IsUUID()
  organizationId: string;

  @IsUUID()
  leaderId: string;
}
