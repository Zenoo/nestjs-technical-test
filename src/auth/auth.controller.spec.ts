/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthedRequest, SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn and return a token', async () => {
      const dto: SignInDto = { username: 'testUser', password: 'password' };
      const token = { accessToken: 'jwt-token' };
      mockAuthService.signIn.mockResolvedValue(token);

      const result = await controller.signIn(dto);

      expect(service.signIn).toHaveBeenCalledWith(dto.username, dto.password);
      expect(result).toEqual(token);
    });
  });

  describe('signUp', () => {
    it('should call AuthService.signUp and return the created user', async () => {
      const dto: SignInDto = { username: 'newUser', password: 'password' };
      const createdUser = { id: 'user-123', username: dto.username };
      mockAuthService.signUp.mockResolvedValue(createdUser);

      const result = await controller.signUp(dto);

      expect(service.signUp).toHaveBeenCalledWith(dto.username, dto.password);
      expect(result).toEqual(createdUser);
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user profile', () => {
      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});
