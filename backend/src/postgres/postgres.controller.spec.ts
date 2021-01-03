import { Test, TestingModule } from '@nestjs/testing';
import { PostgresController } from './postgres.controller';
import { PostgresService } from './postgres.service';

describe('PostgresController', () => {
  let postgresController: PostgresController;
  let postgresService: PostgresService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostgresController],
      providers: [PostgresService],
    }).compile();

    postgresController = app.get<PostgresController>(PostgresController);
    postgresService = app.get<PostgresService>(PostgresService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      jest
        .spyOn(postgresService, 'getMostInvokedQueries')
        .mockImplementation(async () => []);

      expect(await postgresController.getMostInvokedQueries({})).toEqual([]);
    });
  });
});
