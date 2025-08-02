import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsNumberString,
  IsBooleanString,
  IsUrl,
  validateSync,
  Matches,
  IsPort,
  MinLength,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty({ message: 'NODE_ENV is required' })
  @IsIn(['development', 'production', 'test', 'staging'], {
    message: 'NODE_ENV must be one of: development, production, test, staging',
  })
  NODE_ENV: string;

  @IsNumberString()
  @IsPort({ message: 'PORT must be a valid port number (1-65535)' })
  PORT: string;

  @IsString()
  @IsNotEmpty({ message: 'SECRET_KEY is required' })
  @MinLength(32, {
    message: 'SECRET_KEY must be at least 32 characters long for security',
  })
  SECRET_KEY: string;

  @IsString()
  @IsNotEmpty({ message: 'BASE_URL is required' })
  @Matches(/^(https?:\/\/)?([\w.-]+)(:\d+)?(\/[\w.-]*)*\/?$/, {
    message: 'BASE_URL must be a valid URL',
  })
  BASE_URL: string;

  @IsString()
  @IsNotEmpty({ message: 'RESEND_API_KEY is required' })
  @MinLength(32, {
    message: 'RESEND_API_KEY must be at least 32 characters long',
  })
  RESEND_API_KEY: string;

  @IsString()
  @IsNotEmpty({ message: 'FROM_EMAIL is required' })
  FROM_EMAIL: string;

  @IsString()
  @IsNotEmpty({ message: 'CONTACT_EMAIL is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'CONTACT_EMAIL must be a valid email address',
  })
  CONTACT_EMAIL: string;

  @IsString()
  @IsNotEmpty({ message: 'EMAIL_STRATEGY is required' })
  @IsIn(['console', 'resend'], {
    message: 'EMAIL_STRATEGY must be either console or resend',
  })
  EMAIL_STRATEGY: string;

  // Database Configuration
  @IsString()
  @IsNotEmpty({ message: 'DB_DRIVER is required' })
  @IsIn(['postgres', 'mysql', 'sqlite', 'mariadb', 'cockroachdb'], {
    message: 'DB_DRIVER must be a supported database driver',
  })
  DB_DRIVER: string;

  @IsString()
  @IsNotEmpty({ message: 'DB_HOST is required' })
  @Matches(
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/,
    {
      message: 'DB_HOST must be a valid hostname or IP address',
    },
  )
  DB_HOST: string;

  @IsNumberString()
  @IsPort({ message: 'DB_PORT must be a valid port number (1-65535)' })
  DB_PORT: string;

  @IsString()
  @IsNotEmpty({ message: 'DB_USERNAME is required' })
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty({ message: 'DB_PASSWORD is required' })
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty({ message: 'DB_DATABASE is required' })
  DB_DATABASE: string;

  @IsBooleanString()
  @IsNotEmpty({ message: 'DB_SYNCHRONIZE is required (true/false)' })
  DB_SYNCHRONIZE: string;

  @IsBooleanString()
  @IsNotEmpty({ message: 'DB_LOGGING is required (true/false)' })
  DB_LOGGING: string;

  @IsBooleanString()
  @IsNotEmpty({ message: 'DB_SSL is required (true/false)' })
  DB_SSL: string;

  @IsString()
  @IsIn(['require', 'verify-full', 'prefer', 'allow', 'disable'], {
    message:
      'DB_EXTRA_SSL must be one of: require, verify-full, prefer, allow, disable',
  })
  DB_EXTRA_SSL: string;

  @IsNumberString()
  @Matches(/^[1-9]\d*$/, {
    message: 'DB_POOL_MAX must be a positive integer',
  })
  DB_POOL_MAX: string;

  @IsNumberString()
  @Matches(/^[1-9]\d*$/, {
    message: 'DB_POOL_MIN must be a positive integer',
  })
  DB_POOL_MIN: string;

  // Redis Configuration
  @IsUrl({
    protocols: ['redis'],
    require_tld: false,
    allow_underscores: true,
  })
  @IsNotEmpty({ message: 'REDIS_URL is required (redis://host:port)' })
  REDIS_URL: string;

  @IsString()
  @IsNotEmpty({ message: 'STRIPE_SECRET_KEY is required' })
  @MinLength(32, {
    message: 'STRIPE_SECRET_KEY must be at least 32 characters long',
  })
  STRIPE_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty({ message: 'STRIPE_WEBHOOK_SECRET is required' })
  @MinLength(32, {
    message: 'STRIPE_WEBHOOK_SECRET must be at least 32 characters long',
  })
  STRIPE_WEBHOOK_SECRET: string;

  // Plans Configuration
  @IsString()
  @IsNotEmpty({ message: 'PLAN_FREE_ID is required' })
  PLAN_FREE_ID: string;

  @IsString()
  @IsNotEmpty({ message: 'PLAN_PRO_ID is required' })
  PLAN_PRO_ID: string;

  @IsString()
  @IsNotEmpty({ message: 'PLAN_ENTERPRISE_ID is required' })
  PLAN_ENTERPRISE_ID: string;

  // S3 Configuration
  @IsString()
  @IsNotEmpty({ message: 'S3_BUCKET_NAME is required' })
  S3_BUCKET_NAME: string;

  @IsString()
  @IsNotEmpty({ message: 'S3_REGION is required' })
  S3_REGION: string;

  @IsString()
  @IsNotEmpty({ message: 'S3_ENDPOINT is required' })
  S3_ENDPOINT: string;

  @IsString()
  @IsNotEmpty({ message: 'S3_ACCESS_KEY_ID is required' })
  S3_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty({ message: 'S3_SECRET_ACCESS_KEY is required' })
  S3_SECRET_ACCESS_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = Object.values(error.constraints || {});
        return `${error.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  return validatedConfig;
}
