import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMediaDto {
  @IsUUID()
  @IsOptional()
  organizationId: string;

  @IsOptional()
  @IsString()
  alt?: string;
}
