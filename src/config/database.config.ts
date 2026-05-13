import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig } from './app.config';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const config = appConfig();
  const db = config.database;

  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    autoLoadEntities: true,
    synchronize: false, // ✅ jamais true en prod
    logging: db.logging,
  };
};