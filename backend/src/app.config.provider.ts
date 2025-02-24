import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';

const applicationConfig = process.env;

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: applicationConfig.DATABASE_DRIVER,
      url: applicationConfig.DATABASE_URL
    }
  }
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
