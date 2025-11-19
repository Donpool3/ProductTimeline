import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as entities from './entities';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'product_timeline'),
    entities: Object.values(entities),
    synchronize: !isProduction, // Auto-sync in development only
    logging: configService.get('DB_LOGGING', 'false') === 'true',
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: isProduction, // Auto-run migrations in production
    ssl: isProduction
      ? {
          rejectUnauthorized: false,
        }
      : false,
    // Retry configuration - fail fast in development
    retryAttempts: 3,
    retryDelay: 3000,
  };
};
