import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface RedisConfiguration {
  url: string;
}

export interface Configuration {
  env: 'development' | 'production';
  port: number;
  secret: string;
  database: TypeOrmModuleOptions;
  redis: RedisConfiguration;
  baseUrl: string;
  defaultLimit: number;
  email: {
    strategy: 'console' | 'resend';
    resendApiKey?: string;
    fromEmail?: string;
    contact?: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };

  s3: {
    bucket: string;
    region: string;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
  };

  plans: {
    free: {
      id: string;
    };
    pro: {
      id: string;
    };
    enterprise: {
      id: string;
    };
  };
}
