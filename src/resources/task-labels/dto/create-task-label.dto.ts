import {
  IsString,
  IsUUID,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateTaskLabelDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsUUID()
  organizationId: string;
}
