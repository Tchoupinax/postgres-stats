import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { createHash } from 'crypto';

// SELECT query, interval '1 millisecond' * total_time AS exec_time,
// to_char((total_time/sum(total_time) OVER()) * 100, 'FM90D0') || '%'  AS prop_exec_time,
// to_char(calls, 'FM999G999G990') AS ncalls,
// interval '1 millisecond' * (blk_read_time + blk_write_time) AS sync_io_time
// FROM pg_stat_statements
// ORDER BY calls DESC LIMIT 10

@Injectable()
export class PostgresService {
  private logger: Logger = new Logger('PostgresData');

  async getMostInvokedQueries({
    limit = 100,
    offset = 0,
  }): Promise<Array<any>> {
    let result = await getConnection().manager.query(
      `
        SELECT query, to_char(calls, 'FM999G999G990') AS "callCount"
        FROM pg_stat_statements
        WHERE userid = (SELECT usesysid FROM pg_user WHERE usename = current_user LIMIT 1)
        ORDER BY calls DESC
        LIMIT $1 OFFSET $2;
      `,
      [limit, offset],
    );

    const map = new Map();
    result.map((r) => {
      const hash = createHash('sha256').update(r.query).digest('hex');
      if (map.get(hash)) {
        const current = map.get(hash);
        map.set(hash, {
          ...r,
          callCount:
            parseInt(r.callCount.replace(/,/g, ''), 10) +
            parseInt(current.callCount, 10),
        });
      } else {
        map.set(hash, {
          ...r,
          callCount: parseInt(r.callCount.replace(/,/g, ''), 10),
        });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => {
        if (a.callCount > b.callCount) {
          return -1;
        } else if (a.callCount < b.callCount) {
          return 1;
        }
        return 0;
      })
      .map(({ query, callCount }) => ({
        query,
        queryHash: createHash('sha256').update(query).digest('hex'),
        callCount,
      }));
  }

  async getActiveConnections(): Promise<{ query: string, value: number }> {
    const query = 'select count(*) from pg_stat_activity;'
    const [answer] = await getConnection().manager.query(query);

    return { query, value: parseInt(answer.count, 10) };
  }

  async getMaxAllowedConnections(): Promise<{ query: string, value: number }> {
    const query = "select current_setting('max_connections')::int;";
    const [answer] = await getConnection().manager.query(query);

    return { query, value: parseInt(answer.current_setting, 10) };
  }

  async getCacheHitRatio(): Promise<{ query: string, value: number }> {
    const query = "select sum(blks_hit)*100/sum(blks_hit+blks_read) as hit_ratio from pg_stat_database;";
    const [answer] = await getConnection().manager.query(query);

    return { query, value: parseFloat(parseFloat(answer.hit_ratio).toFixed(2)) };
  }

  async getDatabaseSize(): Promise<{ query: string, value: number }> {
    const query = 'select pg_size_pretty(pg_database_size(datname)) from pg_database order by pg_database_size(datname) desc limit 1;';
    const [answer] = await getConnection().manager.query(query);

    const [value, quantity] = answer.pg_size_pretty.split(' ');

    let number = value;
    if (quantity === 'GB') {
      number = number * 1e9;
    }

    return { query, value: parseInt(number, 10) };
  }

  async listUnusedIndexes(): Promise<{ query: string, value: object }> {
    const query = 'select relname as table, indexrelname as "indexName" from pg_stat_all_indexes where idx_scan = 0 and schemaname = \'public\';';
    const answer = await getConnection().manager.query(query);

    const map = new Map();
    answer.forEach(({ table, indexName }) => {
      if (map.get(table)) {
        map.set(table, [indexName, ...map.get(table)]);
      } else {
        map.set(table, [indexName]);
      }
    });

    const result = {};
    for (const key of map.keys()) {
      result[key] = map.get(key);
    }

    return { query, value: result };
  }

  async getCountOfTables(): Promise<{ query: string, value: number }> {
    const query = "select count(*) from information_schema.tables where table_schema = 'public';"
    const [answer] = await getConnection().manager.query(query);

    return { query, value: parseInt(answer.count, 10) };
  }

  async getTotalCountOfRows(): Promise<{ query: string, value: number }> {
    const query = "select sum(n_tup_ins - n_tup_del) as sum FROM pg_stat_all_tables where schemaname = 'public';"
    const [answer] = await getConnection().manager.query(query);

    return { query, value: parseInt(answer.sum || 0, 10) };
  }
}
