import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from '@/entities/Plan';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
  imports: [TypeOrmModule.forFeature([Plan])],
})
export class PlansModule {}
