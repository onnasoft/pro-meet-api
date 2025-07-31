import { Module, forwardRef } from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersController } from './organization-members.controller';
import { OrganizationMember } from '@/entities/OrganizationMember';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '@/services/email/email.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  controllers: [OrganizationMembersController],
  providers: [OrganizationMembersService],
  imports: [
    TypeOrmModule.forFeature([OrganizationMember]),
    UsersModule,
    EmailModule,
    forwardRef(() => OrganizationsModule),
  ],
  exports: [OrganizationMembersService],
})
export class OrganizationMembersModule {}
