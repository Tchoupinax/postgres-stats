import { Controller, Get, Query, Logger } from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Controller('postgres')
export class PostgresController {
  private logger: Logger = new Logger('PostgresController');

  constructor(private readonly postgresService: PostgresService) {}

  @Get('/global-stats')
  async getGlobalStats(): Promise<any> {
    const [
      { value: activeConnections },
      { value: getMaxAllowedConnections },
      { value: getCacheHitRatio },
      { value: getDatabaseSize },
      { value: getCountOfTables },
      { value: getTotalCountOfRows },
      { value: listUnusedIndexes },
    ] = await Promise.all([
      this.postgresService.getActiveConnections(),
      this.postgresService.getMaxAllowedConnections(),
      this.postgresService.getCacheHitRatio(),
      this.postgresService.getDatabaseSize(),
      this.postgresService.getCountOfTables(),
      this.postgresService.getTotalCountOfRows(),
      this.postgresService.listUnusedIndexes(),
    ]);

    return {
      activeConnections,
      getMaxAllowedConnections,
      getCacheHitRatio,
      getDatabaseSize,
      getCountOfTables,
      getTotalCountOfRows,
      listUnusedIndexes,
    };
  }

  @Get('/most-invoked-queries')
  getMostInvokedQueries(@Query() pagination: any): Promise<Array<any>> {
    const { limit, offset } = pagination;

    return this.postgresService.getMostInvokedQueries({
      offset,
      limit: limit > 100 ? 100 : limit,
    });
  }
}
