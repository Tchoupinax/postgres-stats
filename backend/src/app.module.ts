import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';
import { PostgresModule } from './postgres/postgres.module';
import { CronModule } from './cron/cron.module';
import { DefaultModule } from './default/default.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');

const { hostname, username, password, database, port } = config.services.mongo;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${username}:${password}@${hostname}:${port}/${database}`,
    ),
    DefaultModule,
    DataModule,
    PostgresModule,
    CronModule,
  ],
})
export class AppModule {}
