import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@/entities/Organization';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { StripeModule } from '../stripe/stripe.module';
import { PlansModule } from '../plans/plans.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [
    TypeOrmModule.forFeature([Organization]),
    forwardRef(() => OrganizationMembersModule),
    StripeModule,
    PlansModule,
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
