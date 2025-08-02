import { Controller, Get, Param } from '@nestjs/common';
import { PlansService } from './plans.service';
import { Public } from '@/utils/secure';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Public()
  @Get()
  findAndCount() {
    return this.plansService.findAndCount();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne({ where: { id } });
  }
}
