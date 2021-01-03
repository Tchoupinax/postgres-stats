import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { DataModule } from '../data/data.module';
import { PostgresModule } from '../postgres/postgres.module';
import { Data, Datachema } from '../data/schemas/data.schema';

@Module({
  imports: [
    PostgresModule,
    DataModule,
    MongooseModule.forFeature([{ name: Data.name, schema: Datachema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class CronModule {}
