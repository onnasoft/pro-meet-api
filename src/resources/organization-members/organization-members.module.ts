import { Module } from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersController } from './organization-members.controller';
import { OrganizationMember } from '@/entities/OrganizationMember';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OrganizationMembersController],
  providers: [OrganizationMembersService],
  imports: [TypeOrmModule.forFeature([OrganizationMember])],
  exports: [OrganizationMembersService],
})
export class OrganizationMembersModule {}
