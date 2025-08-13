import { Configuration } from '@/types/configuration';
import { registerAs } from '@nestjs/config';

const acceptableEnvironments = ['development', 'production'];

export default registerAs('config', (): Configuration => {
  const env = process.env.NODE_ENV ?? 'development';
  return {
    env: acceptableEnvironments.includes(env) ? (env as any) : 'development',
    port: parseInt(process.env.PORT ?? '3200', 10),
    secret: process.env.SECRET_KEY!,
    baseUrl: process.env.BASE_URL!,
    defaultLimit: parseInt(process.env.DEFAULT_LIMIT ?? '10', 10),
    database: {
      type: process.env.DB_DRIVER as any,
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      ssl: process.env.DB_SSL === 'true',
      extra: {
        ssl:
          process.env.DB_EXTRA_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
      },
    },
    redis: {
      url: process.env.REDIS_URL!,
    },
    email: {
      strategy:
        (process.env.EMAIL_STRATEGY as 'console' | 'resend') || 'console',
      resendApiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL,
      contact: process.env.CONTACT_EMAIL || '',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      productId: process.env.STRIPE_PRODUCT_ID!,
    },

    s3: {
      bucket: process.env.S3_BUCKET_NAME!,
      region: process.env.S3_REGION!,
      endpoint: process.env.S3_ENDPOINT!,
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },

    plans: {
      free: {
        id: process.env.PLAN_FREE_ID || 'free',
      },
      pro: {
        id: process.env.PLAN_PRO_ID || 'pro',
      },
      enterprise: {
        id: process.env.PLAN_ENTERPRISE_ID || 'enterprise',
      },
    },
  };
});
