import * as fs from 'fs';
import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import configuration from './config/configuration';
import { validate } from './config/config.schema';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@/config/config.service';
import { Configuration } from './types/configuration';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailService } from './services/email/email.service';
import { EmailModule } from './services/email/email.module';
import { ContactModule } from './resources/contact/contact.module';
import { NotificationsModule } from './resources/notifications/notifications.module';
import { StripeModule } from './resources/stripe/stripe.module';
import { User } from './entities/User';
import { Notification } from './entities/Notification';
import { I18nModule } from 'nestjs-i18n';
import { CustomLangResolver } from './i18n/custom-lang.resolver';
import { OrganizationsModule } from './resources/organizations/organizations.module';
import { OrganizationMembersModule } from './resources/organization-members/organization-members.module';
import { ProjectsModule } from './resources/projects/projects.module';
import { TasksModule } from './resources/tasks/tasks.module';
import { TaskLabelsModule } from './resources/task-labels/task-labels.module';
import { Organization } from './entities/Organization';
import { OrganizationMember } from './entities/OrganizationMember';
import { Project } from './entities/Project';
import { Task } from './entities/Task';
import { TaskLabel } from './entities/TaskLabel';
import { Plan } from './entities/Plan';
import { PlanTranslation } from './entities/PlanTranslation';
import { SeedModule } from './services/seed/seed.module';
import { PlansModule } from './resources/plans/plans.module';
import { Media } from './entities/Media';
import { MediaModule } from './resources/media/media.module';
import { S3Module } from './services/s3/s3.module';

const envPath = `.env.${process.env.NODE_ENV ?? 'development'}`;
const envFileExists = fs.existsSync(envPath);

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      ignoreEnvFile: !envFileExists,
      load: [configuration],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const configuration = configService.get('config') as Configuration;
        return {
          ...configuration.database,
          entities: [
            User,
            Notification,
            Organization,
            OrganizationMember,
            Project,
            Task,
            TaskLabel,
            Plan,
            PlanTranslation,
            Media,
          ],
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
      inject: [NestConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get('config') as Configuration;
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn: 36000 },
        };
      },
      inject: [NestConfigService],
      global: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), isProd ? 'dist/i18n' : 'src/i18n'),
        watch: true,
      },
      resolvers: [CustomLangResolver],
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ContactModule,
    NotificationsModule,
    StripeModule,
    SeedModule,
    OrganizationsModule,
    OrganizationMembersModule,
    ProjectsModule,
    TasksModule,
    TaskLabelsModule,
    PlansModule,
    MediaModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, CustomLangResolver],
})
export class AppModule {}
