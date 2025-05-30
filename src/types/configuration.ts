import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CockroachConnectionOptions } from 'typeorm/driver/cockroachdb/CockroachConnectionOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { OracleConnectionOptions } from 'typeorm/driver/oracle/OracleConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

export interface RedisConfiguration {
  url: string;
}

export type DatabaseConfiguration = TypeOrmModuleOptions &
  Partial<
    | PostgresConnectionOptions
    | MysqlConnectionOptions
    | CockroachConnectionOptions
    | SqlServerConnectionOptions
    | OracleConnectionOptions
  >;

export interface Configuration {
  env: 'development' | 'production';
  port: number;
  secret: string;
  database: DatabaseConfiguration;
  redis: RedisConfiguration;
  baseUrl: string;
}
