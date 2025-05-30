import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { ValidationPipe } from '@/pipes/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@/entities/User';

class RegisterResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  createdAt: Date;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiBody({ type: RegisterAuthDto })
  async register(@Body(new ValidationPipe()) registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Request() req: Express.Request & { user: User }) {
    return this.authService.login(req.user);
  }
}
