import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Role } from '@/types/role';
import { Media } from '@/entities/Media';
import {
  buildFindManyOptions,
  buildFindOneOptions,
  QueryParams,
} from '@/utils/query';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '@/services/s3/s3.service';
import { User } from '@/entities/User';
import { OrganizationMembersService } from '../organization-members/organization-members.service';
import { MemberRole, MemberStatus } from '@/types/organization-member';
import { In } from 'typeorm';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Controller('media')
export class MediaController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly mediaService: MediaService,
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly i18n: I18nService,
  ) {}

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req: Express.Request & { user: User },
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateMediaDto,
    @I18nLang() lang: string,
  ) {
    if (req.user.role !== Role.Admin) {
      const member = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: payload.organizationId,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['id'],
      });

      if (!member) {
        throw new UnauthorizedException(
          this.i18n.translate('media.not_authorized', {
            lang,
          }),
        );
      }
    }

    const uploadedFile = await this.s3Service.uploadFile(file);

    return this.mediaService.create({
      filename: uploadedFile.filename,
      mimetype: uploadedFile.mime_type,
      size: uploadedFile.filesize,
      url: '/media/download/' + uploadedFile.filename,
      alt: payload.alt,
      organizationId: payload.organizationId,
    });
  }

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Get('download/:filename')
  async download(
    @Request() req: Express.Request & { user: User },
    @Res() res: any,
    @Param('filename') filename: string,
    @I18nLang() lang: string,
  ) {
    const media = await this.mediaService.findOne({
      where: { url: `/media/download/${filename}` },
    });
    if (!media) {
      res.status(404).send('File not found');
      return;
    }

    if (req.user.role !== Role.Admin) {
      const member = await this.organizationMembersService.findOne({
        where: {
          userId: req.user.id,
          organizationId: media.organizationId,
          status: MemberStatus.ACTIVE,
          role: In([
            MemberRole.OWNER,
            MemberRole.ADMIN,
            MemberRole.MEMBER,
            MemberRole.GUEST,
          ]),
        },
        select: ['id'],
      });

      if (!member) {
        throw new UnauthorizedException(
          this.i18n.translate('media.not_authorized', { lang }),
        );
      }
    }

    const stream = await this.s3Service.downloadFile(filename);
    res.setHeader('Content-Type', media.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    stream.pipe(res);
  }

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Get()
  async findAndCount(
    @Request() req: Express.Request & { user: User },
    @Query() query: QueryParams<Media>,
  ) {
    const organizations = (
      await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
        },
        select: ['organizationId'],
      })
    ).map((member) => member.organizationId);
    const options = buildFindManyOptions(query);

    options.where ||= {};
    options.where['organizationId'] = In(organizations);

    return this.mediaService.findAndCount(options);
  }

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Get(':id')
  async findOne(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Query() query: QueryParams<Media>,
  ) {
    const organizations = (
      await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
        },
        select: ['organizationId'],
      })
    ).map((member) => member.organizationId);

    const options = buildFindOneOptions(query);
    options.where ||= {};
    options.where['organizationId'] = In(organizations);
    options.where['id'] = id;

    return this.mediaService.findOne(options);
  }

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Patch(':id')
  async update(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
    @Body() payload: UpdateMediaDto,
  ) {
    const organizations = (
      await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['organizationId'],
      })
    ).map((member) => member.organizationId);

    return this.mediaService.update(
      {
        id,
        organizationId: In(organizations),
      },
      payload,
    );
  }

  @SetMetadata('roles', [Role.Admin, Role.User])
  @Delete(':id')
  async remove(
    @Request() req: Express.Request & { user: User },
    @Param('id') id: string,
  ) {
    const organizations = (
      await this.organizationMembersService.find({
        where: {
          userId: req.user.id,
          status: MemberStatus.ACTIVE,
          role: In([MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MEMBER]),
        },
        select: ['organizationId'],
      })
    ).map((member) => member.organizationId);

    return this.mediaService.remove({
      id,
      organizationId: In(organizations),
    });
  }
}
