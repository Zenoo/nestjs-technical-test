/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Run, RunType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RunCreateDto, RunUpdateDto } from './runs.dto';
import { RunsService } from './runs.service';
import { NotFoundException } from '@nestjs/common';

const sampleUserId = 'user-123';
const sampleRuns: Run[] = [
  {
    id: 'run-1',
    type: RunType.TRAINING,
    start: new Date(),
    distance: 10,
    duration: 3600000,
    averagePace: 6,
    averageSpeed: 10,
    userId: 'user-123',
    comment: 'Morning run',
  },
  {
    id: 'run-2',
    type: RunType.LEISURE,
    start: new Date(),
    distance: 5,
    duration: 1800000,
    averagePace: 6,
    averageSpeed: 10,
    userId: 'user-123',
    comment: null,
  },
];

describe('RunsService', () => {
  let service: RunsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunsService,
        {
          provide: PrismaService,
          useValue: {
            run: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RunsService>(RunsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a run with calculated average speed and pace', async () => {
      const userId = sampleRuns[0].userId;
      const data: RunCreateDto = {
        type: sampleRuns[0].type,
        start: sampleRuns[0].start,
        distance: sampleRuns[0].distance,
        duration: sampleRuns[0].duration,
        comment: sampleRuns[0].comment ?? undefined,
      };
      const expectedRun = {
        id: sampleRuns[0].id,
        ...data,
        averageSpeed: sampleRuns[0].averageSpeed,
        averagePace: sampleRuns[0].averagePace,
        userId,
        comment: data.comment ?? null,
      };

      jest.spyOn(prisma.run, 'create').mockResolvedValue(expectedRun);

      const result = await service.create(userId, data);

      expect(prisma.run.create).toHaveBeenCalledWith({
        data: {
          ...data,
          averageSpeed: sampleRuns[0].averageSpeed,
          averagePace: sampleRuns[0].averagePace,
          userId,
          comment: data.comment ?? null,
        },
      });
      expect(result).toEqual(expectedRun);
    });
  });

  describe('findAll', () => {
    it('should return all runs', async () => {
      jest.spyOn(prisma.run, 'findMany').mockResolvedValue(sampleRuns);

      const result = await service.findAll();

      expect(prisma.run.findMany).toHaveBeenCalled();
      expect(result).toEqual(sampleRuns);
    });
  });

  describe('findOwn', () => {
    it('should return runs for a specific user', async () => {
      const userId = sampleUserId;
      jest.spyOn(prisma.run, 'findMany').mockResolvedValue(sampleRuns);

      const result = await service.findOwn(userId);

      expect(prisma.run.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(sampleRuns);
    });
  });

  describe('findOne', () => {
    it('should return a single run by ID', async () => {
      const uuid = sampleRuns[0].id;
      const run = sampleRuns[0];
      jest.spyOn(prisma.run, 'findUnique').mockResolvedValue(run);

      const result = await service.findOne(uuid);

      expect(prisma.run.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });
      expect(result).toEqual(run);
    });
  });

  describe('update', () => {
    it('should update a run by ID with new averages if distance or duration is provided', async () => {
      const uuid = sampleRuns[0].id;
      const data: RunUpdateDto = { distance: 15, duration: 5400000 }; // New distance and duration
      const currentRun = sampleRuns[0];
      const updatedRun = {
        ...currentRun,
        ...data,
        averageSpeed: 10, // Expected average speed
        averagePace: 6, // Expected average pace
      };

      jest.spyOn(prisma.run, 'findUnique').mockResolvedValue(currentRun);
      jest.spyOn(prisma.run, 'update').mockResolvedValue(updatedRun);

      const result = await service.update(uuid, data);

      expect(prisma.run.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });
      expect(prisma.run.update).toHaveBeenCalledWith({
        where: { id: uuid },
        data: {
          ...data,
          averageSpeed: 10, // Expected average speed
          averagePace: 6, // Expected average pace
        },
      });
      expect(result).toEqual(updatedRun);
    });

    it('should update a run by ID without recalculating averages if distance and duration are not provided', async () => {
      const uuid = sampleRuns[0].id;
      const data: RunUpdateDto = { comment: 'Updated comment' }; // No distance or duration
      const updatedRun = { ...sampleRuns[0], ...data };

      jest.spyOn(prisma.run, 'findUnique').mockResolvedValue(sampleRuns[0]);
      jest.spyOn(prisma.run, 'update').mockResolvedValue(updatedRun);

      const result = await service.update(uuid, data);

      expect(prisma.run.findUnique).not.toHaveBeenCalled(); // No need to fetch current run
      expect(prisma.run.update).toHaveBeenCalledWith({
        where: { id: uuid },
        data,
      });
      expect(result).toEqual(updatedRun);
    });

    it('should throw a NotFoundException if the run does not exist', async () => {
      const uuid = 'non-existent-id';
      const data: RunUpdateDto = { distance: 15, duration: 5400000 };

      jest.spyOn(prisma.run, 'findUnique').mockResolvedValue(null);

      await expect(service.update(uuid, data)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.run.findUnique).toHaveBeenCalledWith({
        where: { id: uuid },
      });
      expect(prisma.run.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a run by ID', async () => {
      const uuid = sampleRuns[0].id;
      const deletedRun = sampleRuns[0];
      jest.spyOn(prisma.run, 'delete').mockResolvedValue(deletedRun);

      const result = await service.remove(uuid);

      expect(prisma.run.delete).toHaveBeenCalledWith({
        where: { id: uuid },
      });
      expect(result).toEqual(deletedRun);
    });
  });
});
