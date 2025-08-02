import { Inject, Injectable } from '@nestjs/common';
import { S3_PROVIDER } from './s3.provider';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import Stream from 'stream';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject(S3_PROVIDER) private readonly s3: S3Client,
  ) {
    const config = this.configService.get('config') as Configuration;
    this.bucket = config.s3.bucket;
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = randomUUID() + '-' + file.originalname;
    const mimetype = file.mimetype || 'application/octet-stream';
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: mimetype,
    });

    await this.s3.send(command);

    return {
      filename: filename,
      size: file.buffer.byteLength,
      mime_type: mimetype,
      filesize: file.buffer.byteLength,
    };
  }

  async downloadFile(key: string): Promise<Stream> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3.send(command);
    return response.Body as Stream;
  }
}
