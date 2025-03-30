/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

const testUser1 = 'foo';
const userId1 = uuidv4();

const userArray: User[] = [
  {
    id: userId1,
    username: testUser1,
    password: 'hashed-password',
    roles: [UserRole.ADMIN],
    autoPublishRuns: false,
  },
  {
    id: uuidv4(),
    username: 'bar',
    password: 'hashed-password',
    roles: [],
    autoPublishRuns: false,
  },
];

const oneUser = userArray[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findFirst: jest.fn().mockResolvedValue(oneUser),
    findUnique: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn().mockResolvedValue(oneUser),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear mock call history before each test

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user if the username is unique', async () => {
      const dto = { username: 'newUser', password: 'password', roles: [] };
      const createdUser = { ...dto, id: uuidv4() };

      db.user.findFirst.mockResolvedValue(null); // No existing user with the same username
      db.user.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username: dto.username },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(createdUser);
    });

    it('should throw a ConflictException if the username already exists', async () => {
      const dto = { username: 'existingUser', password: 'password', roles: [] };

      db.user.findFirst.mockResolvedValue(oneUser); // Existing user with the same username

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username: dto.username },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(userArray);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne(userId1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId1 },
      });
      expect(result).toEqual(oneUser);
    });

    it('should return null if user is not found', async () => {
      db.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      db.user.findUnique.mockResolvedValue(oneUser);

      const username = 'foo';
      const result = await service.findByUsername(username);

      expect(result).toEqual(oneUser);
    });

    it('should return null if user is not found', async () => {
      db.user.findUnique.mockResolvedValue(null);

      const result = await service.findByUsername('non-existent-username');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'non-existent-username' },
        omit: { password: false },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user with a hashed password if provided', async () => {
      const dto = {
        username: 'updatedUser',
        password: 'newPassword',
      };
      const hashedPassword = 'hashed-newPassword';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);
      db.user.findFirst.mockResolvedValue(null); // No conflicting username
      db.user.update.mockResolvedValue(oneUser);

      const result = await service.update(userId1, dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: dto.username,
          id: { not: userId1 },
        },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId1 },
        data: { ...dto, password: hashedPassword },
      });
      expect(result).toEqual(oneUser);
    });

    it('should update a user without changing the password if not provided', async () => {
      const dto = { username: 'updatedUser' };

      db.user.findFirst.mockResolvedValue(null); // No conflicting username
      db.user.update.mockResolvedValue(oneUser);

      const result = await service.update(userId1, dto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: dto.username,
          id: { not: userId1 },
        },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId1 },
        data: dto,
      });
      expect(result).toEqual(oneUser);
    });

    it('should throw a ConflictException if the username already exists', async () => {
      const dto = { username: 'existingUser' };

      db.user.findFirst.mockResolvedValue(oneUser); // Conflicting username

      await expect(service.update(userId1, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: dto.username,
          id: { not: userId1 },
        },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const result = await service.remove(userId1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId1 },
      });
      expect(result).toEqual(oneUser);
    });
  });
});
