import { ContractType, EducationLevel, JobStatus, JobType } from '@/types/job';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsDateString,
  Length,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsEnum(JobType)
  type: JobType;

  @IsEnum(ContractType)
  contractType: ContractType;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  location?: string;

  @IsOptional()
  @IsDateString()
  postedAt?: Date;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNumber()
  recruiterFee?: number;

  @IsOptional()
  @IsString()
  experienceRequired?: string;

  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsString()
  skillsRequired?: string;

  @IsUUID()
  organizationId: string;

  @IsUUID()
  projectId: string;
}
