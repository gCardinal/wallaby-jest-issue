import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config';
import { INestApplication } from '@nestjs/common';
import { Logger } from './logging/logger.service';

export const bootstrap = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const config: ConfigService<Config> = app.get(ConfigService);

  app.useLogger(logger);

  await app.listen(config.get('APP_PORT', '8080'));

  return Promise.resolve(app);
};
