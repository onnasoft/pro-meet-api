import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMediaDto {
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsOptional()
  @IsString()
  alt?: string;
}
