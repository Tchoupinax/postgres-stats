import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { DataService } from './data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { Data } from './schemas/data.schema';

@Controller('data')
export class DataController {
  private logger: Logger = new Logger('DataController');

  constructor(private readonly DataService: DataService) {}

  @Post()
  async create(@Body() createDataDto: CreateDataDto) {
    await this.DataService.create(createDataDto);
  }

  @Get()
  async findAll(@Query() pagination: any): Promise<Data[]> {
    const { limit, offset, queryHash } = pagination;

    if (!queryHash) {
      throw new HttpException(
        'Query param named "query" is required',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.DataService.findAll({
      offset: offset && parseInt(offset, 10),
      limit: limit && limit < 1000 ? parseInt(limit, 10) : 1000,
      queryHash,
    });
  }
}
