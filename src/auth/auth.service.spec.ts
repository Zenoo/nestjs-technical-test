/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const username = 'testUser';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 'user-123',
        username,
        password: hashedPassword,
        roles: [],
      };
      const token = 'jwt-token';

      mockUsersService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await service.signIn(username, password);

      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, user.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        roles: user.roles,
      });
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const username = 'nonexistentUser';
      const password = 'password';

      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const username = 'testUser';
      const password = 'wrongPassword';
      const user = {
        id: 'user-123',
        username,
        password: 'hashed-password',
        roles: [],
      };

      mockUsersService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a JWT token', async () => {
      const username = 'newUser';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 'user-123',
        username,
        password: hashedPassword,
        roles: [],
      };
      const token = 'jwt-token';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);
      mockUsersService.create.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await service.signUp(username, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        username,
        password: hashedPassword,
        roles: [],
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        roles: user.roles,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
