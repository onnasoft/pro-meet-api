import { TaskPriority, TaskStatus } from '@/types/task';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDate,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  @MaxLength(50)
  key: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsOptional()
  @IsDate()
  dueDate?: Date | null;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number | null;

  @IsOptional()
  @IsDate()
  completedAt?: Date | null;

  @IsUUID()
  projectId: string;

  @IsUUID()
  creatorId: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  labelIds?: string[];
}
