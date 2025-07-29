import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [UsersModule],
  exports: [StripeService],
})
export class StripeModule {}
