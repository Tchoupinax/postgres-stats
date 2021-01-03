import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostgresCntroller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  it('/postgres/global-stats (GET)', async () => {
    const data = await request(app.getHttpServer())
      .get('/postgres/global-stats')
      .expect(200);

    return expect(data.body).toEqual(
      expect.objectContaining({
        activeConnections: expect.any(Number),
        getMaxAllowedConnections: expect.any(Number),
        getCacheHitRatio: expect.any(Number),
        getDatabaseSize: expect.any(Number),
        getCountOfTables: expect.any(Number),
        getTotalCountOfRows: expect.any(Number),
        listUnusedIndexes: expect.any(Object),
      }),
    );
  });

  it('/postgres/most-invoked-queries (GET)', async () => {
    const data = await request(app.getHttpServer())
      .get('/postgres/most-invoked-queries')
      .expect(200);

    return expect(Array.isArray(data.body)).toBeTruthy();
  });
});
