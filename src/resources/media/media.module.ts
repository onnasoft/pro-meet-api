import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@/entities/Media';
import { S3Module } from '@/services/s3/s3.module';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    TypeOrmModule.forFeature([Media]),
    S3Module,
    OrganizationMembersModule,
  ],
})
export class MediaModule {}
