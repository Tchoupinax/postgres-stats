import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresController } from './postgres.controller';
import { PostgresService } from './postgres.service';
import { configService } from '../config/config.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [PostgresController],
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule {}
