import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';

const appConfig = process.env;

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: appConfig.DATABASE_DRIVER || 'postgres',
      url: appConfig.DATABASE_URL || 'postgres://localhost:5432/prac',
      username: appConfig.DATABASE_USERNAME || 'prac',
      password: appConfig.DATABASE_PASSWORD || 'prac',
      host: appConfig.DATABASE_URL ? new URL(appConfig.DATABASE_URL).hostname || 'localhost' : 'localhost',
      port: appConfig.DATABASE_URL ? Number(new URL(appConfig.DATABASE_URL).port) || 5432 : 5432,
      database: appConfig.DATABASE_URL ? new URL(appConfig.DATABASE_URL).pathname.slice(1) || 'prac' : 'prac'
    },
    port: Number(appConfig.PORT) || 3000
  }
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}
