import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';
import { CreateGlobalStatDto } from './dto/create-global-stat.dto';
import { Data, DataDocument } from './schemas/data.schema';
import { GlobalStatData, DataDocumentGlobalStat } from './schemas/global-stat.schema';

@Injectable()
export class DataService {
  private logger: Logger = new Logger('DataService');

  constructor(
    @InjectModel(Data.name) private readonly dataModel: Model<DataDocument>,
    @InjectModel(Data.name) private readonly dataModelGlobalStat: Model<DataDocumentGlobalStat>,
  ) {}

  async create(data: CreateDataDto): Promise<Data> {
    const createdData = new this.dataModel(data);
    return createdData.save();
  }

  async createGlobalStat(data: CreateGlobalStatDto): Promise<Data> {
    const createdData = new this.dataModel(data);
    return createdData.save();
  }

  async findMostRecent(query: string) {
    return this.dataModel.find({ query }).sort({ date: -1 }).limit(1);
  }

  async findAll({ limit = 100, offset = 0, queryHash }): Promise<Data[]> {
    return this.dataModel
      .find({ queryHash }, { _id: 0 })
      .select(['query', 'date', 'callCountSinceLast', 'queryHash', 'value'])
      .limit(limit)
      .skip(offset)
      .sort({ date: -1 })
      .exec();
  }
}
