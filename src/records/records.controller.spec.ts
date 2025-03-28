/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { AuthedRequest } from '../auth/dto/sign-in.dto';

describe('RecordsController', () => {
  let controller: RecordsController;
  let service: RecordsService;

  const mockRecordsService = {
    getOwn: jest.fn(),
    getTop: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-123',
      username: 'testUser',
      roles: ['USER'],
    },
  } as unknown as AuthedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        {
          provide: RecordsService,
          useValue: mockRecordsService,
        },
      ],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOwn', () => {
    it("should return the user's records for the given distances", async () => {
      const distances = [5, 10];
      const records = {
        5: [{ time: 30, distance: 5, averagePace: 6, runId: 'run-1' }],
        10: [{ time: 60, distance: 10, averagePace: 6, runId: 'run-2' }],
      };

      mockRecordsService.getOwn.mockResolvedValue(records);

      const result = await controller.getOwn(mockRequest, distances);

      expect(service.getOwn).toHaveBeenCalledWith(
        mockRequest.user.id,
        distances,
      );
      expect(result).toEqual(records);
    });
  });

  describe('getAll', () => {
    it('should return the top records for the given distances', async () => {
      const distances = [5, 10];
      const records = {
        5: [{ time: 30, distance: 5, averagePace: 6, runId: 'run-1' }],
        10: [{ time: 60, distance: 10, averagePace: 6, runId: 'run-2' }],
      };

      mockRecordsService.getTop.mockResolvedValue(records);

      const result = await controller.getAll(distances);

      expect(service.getTop).toHaveBeenCalledWith(distances);
      expect(result).toEqual(records);
    });
  });
});
