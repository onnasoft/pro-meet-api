import { Configuration } from '@/types/configuration';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3_PROVIDER = 'S3_CLIENT';

export const S3Provider = {
  provide: S3_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const config = configService.get('config') as Configuration;
    return new S3Client({
      region: config.s3.region,
      endpoint: config.s3.endpoint,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      forcePathStyle: true,
    });
  },
  inject: [ConfigService],
};
