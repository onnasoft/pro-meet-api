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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '@/types/role';
import { User } from '@/entities/User';
import { Request } from 'express';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { Post as PostEntity } from '@/entities/Post';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() payload: CreatePostDto) {
    return this.postsService.create({
      content: payload.content,
      imageUrl: payload.imageUrl,
      commentsCount: 0,
      liked: false,
      likesCount: 0,
      sharesCount: 0,
      timestamp: new Date(),
    });
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('')
  async findAndCount(
    @Req() req: Request & { user: User },
    @Query() query: QueryParams<PostEntity>,
  ) {
    const options = buildFindManyOptions<PostEntity>(query);

    return this.postsService.findAndCount(options);
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get(':id')
  async findOne(
    @Req() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Query() query: QueryParams<PostEntity>,
  ) {
    const options = buildFindOneOptions<PostEntity>(query);
    return this.postsService.findOne({
      ...options,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
