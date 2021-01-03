import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { assert } from 'console';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');

class ConfigService {
  public isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    assert(
      config.services.postgres.hostname,
      '[Postgresql] - hostname is required',
    );
    assert(config.services.postgres.port, '[Postgresql] - port is required');
    assert(
      config.services.postgres.username,
      '[Postgresql] - username is required',
    );
    assert(
      config.services.postgres.password,
      '[Postgresql] - password is required',
    );
    assert(
      config.services.postgres.database,
      '[Postgresql] - database is required',
    );

    return {
      type: 'postgres',

      host: config.services.postgres.hostname,
      port: config.services.postgres.port,
      username: config.services.postgres.username,
      password: config.services.postgres.password,
      database: config.services.postgres.database,

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      extra: {
        ssl: config.services.postgres.ssl,
      },
    };
  }
}

const configService = new ConfigService();

export { configService };
