import { UserType } from '@/types/user-type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'auth.name_too_short' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'auth.invalid_email' })
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  @Matches(/^[a-zA-Z0-9\s]*$/, {
    message: 'auth.company_invalid',
  })
  company?: string;

  @ApiProperty({
    description: 'User type: recruiter or candidate',
    enum: UserType,
    example: UserType.RECRUITER,
  })
  @IsEnum(UserType, { message: 'auth.invalid_user_type' })
  userType: UserType;

  @ApiProperty()
  @IsString()
  @Length(8, 255, { message: 'auth.password_too_short' })
  @Matches(/(?=.*[a-z])/, {
    message: 'auth.password_lowercase',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'auth.password_uppercase',
  })
  @Matches(/(?=.*\d)/, {
    message: 'auth.password_number',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  terms: boolean;
}
