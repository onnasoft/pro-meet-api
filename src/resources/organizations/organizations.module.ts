import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@/entities/Organization';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [
    TypeOrmModule.forFeature([Organization]),
    OrganizationMembersModule,
  ],
})
export class OrganizationsModule {}
