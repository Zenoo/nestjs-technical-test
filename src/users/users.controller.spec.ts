/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { AuthedRequest } from '../auth/dto/sign-in.dto';
import { UserCreateDto, UserUpdateDto } from './users.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-123',
      roles: [UserRole.ADMIN],
    },
  } as AuthedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: UserCreateDto = {
        username: 'newUser',
        password: 'password',
        roles: [],
      };
      const createdUser = { id: 'user-123', ...dto };
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 'user-1' }, { id: 'user-2' }];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 'user-123', username: 'testUser' };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('user-123');

      expect(service.findOne).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user if authorized', async () => {
      const dto: UserUpdateDto = { username: 'updatedUser' };
      const updatedUser = { id: 'user-123', ...dto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('user-123', dto, mockRequest);

      expect(service.update).toHaveBeenCalledWith('user-123', dto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if unauthorized to update another user', async () => {
      const dto: UserUpdateDto = { username: 'updatedUser' };
      const unauthorizedRequest = {
        user: { id: 'user-456', roles: [] },
      } as unknown as AuthedRequest;

      await expect(
        async () =>
          await controller.update('user-123', dto, unauthorizedRequest),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if roles are updated by a non-admin', async () => {
      const dto: UserUpdateDto = { username: 'xxx', roles: [UserRole.ADMIN] };
      const unauthorizedRequest = {
        user: { id: 'user-123', roles: [] },
      } as unknown as AuthedRequest;

      await expect(async () =>
        controller.update('user-123', dto, unauthorizedRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should delete a user if authorized', async () => {
      const deletedUser = { id: 'user-234' };
      mockUsersService.remove.mockResolvedValue(deletedUser);

      const result = await controller.remove('user-234', mockRequest);

      expect(service.remove).toHaveBeenCalledWith('user-234');
      expect(result).toEqual(deletedUser);
    });

    it('should throw an error if an admin tries to delete themselves', async () => {
      const selfDeleteRequest = {
        user: { id: 'user-123', roles: [UserRole.ADMIN] },
      } as AuthedRequest;

      await expect(async () =>
        controller.remove('user-123', selfDeleteRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
