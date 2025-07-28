import { PartialType } from '@nestjs/swagger';
import { CreateTaskLabelDto } from './create-task-label.dto';

export class UpdateTaskLabelDto extends PartialType(CreateTaskLabelDto) {}
