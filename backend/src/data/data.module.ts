import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Data, Datachema } from './schemas/data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Data.name, schema: Datachema }]),
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
