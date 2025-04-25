import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenvConfig({ path: envFile, override: true });

const {
  DATABASE_CONNECTION,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

if (
  !DATABASE_CONNECTION ||
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_USERNAME ||
  !DATABASE_PASSWORD ||
  !DATABASE_NAME
) {
  throw new Error(
    'Missing critical environment variables for database connection',
  );
}

const config: DataSourceOptions = {
  type: DATABASE_CONNECTION as
    | 'mysql'
    | 'postgres'
    | 'mariadb'
    | 'sqlite'
    | 'mssql',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10) || 5432,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [`${__dirname}/../entity/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../database/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

console.table(config);

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config);
