/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { RecordsService } from './records.service';
import { Run } from '@prisma/client';

describe('RecordsService', () => {
  let service: RecordsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOwn', () => {
    it('should return records for the user', async () => {
      const userId = 'user-123';
      const distances = [5, 10];
      const mockRuns: Run[] = [
        {
          id: 'run-1',
          type: 'TRAINING',
          start: new Date(),
          distance: 5,
          duration: 1800000,
          averageSpeed: 10,
          averagePace: 6,
          comment: null,
          public: true,
          userId,
        },
        {
          id: 'run-2',
          type: 'TRAINING',
          start: new Date(),
          distance: 10,
          duration: 3600000,
          averageSpeed: 10,
          averagePace: 6,
          comment: null,
          public: true,
          userId,
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValueOnce([mockRuns[0]]);
      mockPrismaService.$queryRaw.mockResolvedValueOnce([mockRuns[1]]);

      const result = await service.getOwn(userId, distances);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
      expect(prisma.$queryRaw).toHaveBeenNthCalledWith(
        1,
        expect.any(Array),
        userId,
        distances[0],
      );
      expect(prisma.$queryRaw).toHaveBeenNthCalledWith(
        2,
        expect.any(Array),
        userId,
        distances[1],
      );
      expect(result).toEqual({
        5: [
          {
            time: mockRuns[0].averagePace * 5,
            distance: 5,
            averagePace: mockRuns[0].averagePace,
            runId: mockRuns[0].id,
          },
        ],
        10: [
          {
            time: mockRuns[1].averagePace * 10,
            distance: 10,
            averagePace: mockRuns[1].averagePace,
            runId: mockRuns[1].id,
          },
        ],
      });
    });
  });

  describe('getTop', () => {
    it('should return top records for the user', async () => {
      const userId = 'user-123';
      const distances = [5, 10];
      const mockRuns: Run[] = [
        {
          id: 'run-1',
          type: 'TRAINING',
          start: new Date(),
          distance: 5,
          duration: 1800000,
          averageSpeed: 10,
          averagePace: 6,
          comment: null,
          public: true,
          userId,
        },
        {
          id: 'run-2',
          type: 'TRAINING',
          start: new Date(),
          distance: 10,
          duration: 3600000,
          averageSpeed: 10,
          averagePace: 6,
          comment: null,
          public: true,
          userId,
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValueOnce([mockRuns[0]]);
      mockPrismaService.$queryRaw.mockResolvedValueOnce([mockRuns[1]]);

      const result = await service.getTop(distances);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(2 + 2); // 2 for getOwn and 2 for getTop
      expect(prisma.$queryRaw).toHaveBeenNthCalledWith(
        1,
        expect.any(Array),
        userId,
        distances[0],
      );
      expect(prisma.$queryRaw).toHaveBeenNthCalledWith(
        2,
        expect.any(Array),
        userId,
        distances[1],
      );
      expect(result).toEqual({
        5: [
          {
            time: mockRuns[0].averagePace * 5,
            distance: 5,
            averagePace: mockRuns[0].averagePace,
            runId: mockRuns[0].id,
          },
        ],
        10: [
          {
            time: mockRuns[1].averagePace * 10,
            distance: 10,
            averagePace: mockRuns[1].averagePace,
            runId: mockRuns[1].id,
          },
        ],
      });
    });
  });
});
