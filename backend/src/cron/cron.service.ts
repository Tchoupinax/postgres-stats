import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createHash } from 'crypto';
import { PostgresService } from '../postgres/postgres.service';
import { DataService } from '../data/data.service';

@Injectable()
export class CronService {
  private logger: Logger = new Logger('CronService');

  constructor(
    private postgresService: PostgresService,
    private dataService: DataService,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async mostInvokedQueries() {
    this.logger.debug('Most invoked query');

    let data;
    try {
      data = await this.postgresService.getMostInvokedQueries({
        limit: 50,
      });
    } catch (err) {
      this.logger.error(err.message);
      return;
    }

    data.forEach(async (currentQuery) => {
      const [lastEntry] = await this.dataService.findMostRecent(
        currentQuery.query,
      );

      const { query, callCount } = currentQuery;

      let callCountSinceLast;

      if (!lastEntry) {
        callCountSinceLast = 0;
      } else {
        callCountSinceLast = currentQuery.callCount - lastEntry.value;
      }

      this.dataService.create({
        query,
        queryHash: createHash('sha256').update(query).digest('hex'),
        value: callCount,
        callCountSinceLast: callCountSinceLast,
        date: new Date(),
      });
    });
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async globalStats() {
    this.logger.debug('Glogal postgres stats');

    const methods = [
      'getActiveConnections',
      'getMaxAllowedConnections',
      'getCacheHitRatio',
      'getDatabaseSize',
      'getCountOfTables',
      'getTotalCountOfRows',
    ];

    methods.forEach(async (method) => {
      let query;
      let value;

      try {
        ({ query, value } = await this.postgresService[method]({
          limit: 50,
        }));
      } catch (err) {
        this.logger.error(err.message);
        return;
      }

      const [lastEntry] = await this.dataService.findMostRecent(query);

      let callCountSinceLast;
      if (!lastEntry) {
        callCountSinceLast = 0;
      } else {
        callCountSinceLast = value; 
      }

      this.dataService.createGlobalStat({
        query,
        queryHash: createHash('sha256').update(query).digest('hex'),
        value,
        date: new Date(),
      });
    })
  }
}
