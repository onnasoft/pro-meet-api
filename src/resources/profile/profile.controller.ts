import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Req,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { Profile } from '@/entities/Profile';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('')
  async findAndCount(
    @Req() req: Request & { user: User },
    @Query() query: QueryParams<Profile>,
  ) {
    const options = buildFindManyOptions<Profile>(query);

    return this.profileService.findAndCount(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  async findOne(
    @Req() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Query() query: QueryParams<Profile>,
  ) {
    const options = buildFindOneOptions<Profile>(query);
    return this.profileService.findOne({
      ...options,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update({ id }, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
