import { IsOptional, IsIn, IsString, Length } from 'class-validator';
import * as moment from 'moment-timezone';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Preferred language',
    enum: ['es', 'en', 'fr', 'ja', 'zh'],
    example: 'en',
  })
  @IsOptional()
  @IsIn(['es', 'en', 'fr', 'ja', 'zh'])
  language?: string;

  @ApiPropertyOptional({
    description: 'Timezone (IANA format)',
    enum: moment.tz.names(),
    example: 'America/New_York',
  })
  @IsOptional()
  @IsString()
  @IsIn(moment.tz.names())
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Newsletter subscription status',
    example: true,
  })
  @IsOptional()
  newsletter?: boolean;
}
