import { Test, TestingModule } from '@nestjs/testing';
import { Run, RunType } from '@prisma/client';
import { AuthedRequest } from '../auth/dto/sign-in.dto';
import { RunsController } from './runs.controller';
import { RunsService } from './runs.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

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
    userId: sampleUserId,
    comment: 'Morning run',
    public: true,
  },
  {
    id: 'run-2',
    type: RunType.LEISURE,
    start: new Date(),
    distance: 5,
    duration: 1800000,
    averagePace: 6,
    averageSpeed: 10,
    userId: 'user-456',
    comment: null,
    public: true,
  },
];

describe('RunsController', () => {
  let controller: RunsController;

  const mockRunsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOwn: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: sampleUserId,
      roles: [],
    },
  } as unknown as AuthedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunsController],
      providers: [
        {
          provide: RunsService,
          useValue: mockRunsService,
        },
      ],
    }).compile();

    controller = module.get<RunsController>(RunsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a run', async () => {
      const dto = {
        type: RunType.TRAINING,
        start: new Date(),
        distance: 10,
        duration: 3600000,
        comment: 'Morning run',
      };
      const createdRun = { id: 'run-123', ...dto, userId: mockRequest.user.id };
      mockRunsService.create.mockResolvedValue(createdRun);

      const result = await controller.create(dto, mockRequest);

      expect(mockRunsService.create).toHaveBeenCalledWith(
        mockRequest.user.id,
        dto,
      );
      expect(result).toEqual(createdRun);
    });
  });

  describe('findAll', () => {
    it('should return all runs (admin only)', async () => {
      mockRunsService.findAll.mockResolvedValue(sampleRuns);

      const result = await controller.findAll();

      expect(mockRunsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(sampleRuns);
    });
  });

  describe('findOwn', () => {
    it('should return runs for the authenticated user', async () => {
      const runs = [sampleRuns[0]];
      mockRunsService.findOwn.mockResolvedValue(runs);

      const result = await controller.findOwn(mockRequest);

      expect(mockRunsService.findOwn).toHaveBeenCalledWith(mockRequest.user.id);
      expect(result).toEqual(runs);
    });
  });

  describe('findOne', () => {
    it('should return a single run if authorized', async () => {
      const run = sampleRuns[0];
      mockRunsService.findOne.mockResolvedValue(run);

      const result = await controller.findOne(sampleUserId, mockRequest);

      expect(mockRunsService.findOne).toHaveBeenCalledWith(sampleUserId);
      expect(result).toEqual(run);
    });

    it('should throw an error if the run is not found', async () => {
      mockRunsService.findOne.mockResolvedValue(null);

      await expect(async () =>
        controller.findOne(sampleUserId, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if unauthorized', async () => {
      const run = sampleRuns[1];
      mockRunsService.findOne.mockResolvedValue(run);

      await expect(async () =>
        controller.findOne(sampleRuns[1].id, mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update a run if authorized', async () => {
      const dto = { comment: 'Updated comment' };
      const run = sampleRuns[0];
      const updatedRun = { ...run, ...dto };
      mockRunsService.findOne.mockResolvedValue(run);
      mockRunsService.update.mockResolvedValue(updatedRun);

      const result = await controller.update(
        sampleRuns[0].id,
        dto,
        mockRequest,
      );

      expect(mockRunsService.findOne).toHaveBeenCalledWith(sampleRuns[0].id);
      expect(mockRunsService.update).toHaveBeenCalledWith(
        sampleRuns[0].id,
        dto,
      );
      expect(result).toEqual(updatedRun);
    });

    it('should throw an error if the run is not found', async () => {
      mockRunsService.findOne.mockResolvedValue(null);

      await expect(async () =>
        controller.update(sampleRuns[0].id, {}, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if unauthorized', async () => {
      const run = sampleRuns[1];
      mockRunsService.findOne.mockResolvedValue(run);

      await expect(async () =>
        controller.update(sampleRuns[1].id, {}, mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should delete a run if authorized', async () => {
      const run = sampleRuns[0];
      mockRunsService.findOne.mockResolvedValue(run);
      mockRunsService.remove.mockResolvedValue(run);

      const result = await controller.remove(sampleRuns[0].id, mockRequest);

      expect(mockRunsService.findOne).toHaveBeenCalledWith(sampleRuns[0].id);
      expect(mockRunsService.remove).toHaveBeenCalledWith(sampleRuns[0].id);
      expect(result).toEqual(run);
    });

    it('should throw an error if the run is not found', async () => {
      mockRunsService.findOne.mockResolvedValue(null);

      await expect(async () =>
        controller.remove('run-999', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if unauthorized', async () => {
      const run = sampleRuns[1];
      mockRunsService.findOne.mockResolvedValue(run);

      await expect(async () =>
        controller.remove(sampleRuns[1].id, mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
