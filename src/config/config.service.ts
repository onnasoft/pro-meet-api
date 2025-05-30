// src/config/config.service.ts
import { Configuration } from '@/types/configuration';
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService extends NestConfigService<{
  config: Configuration;
}> {}
