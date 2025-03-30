import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { AuthedRequest, JwtUserDto, UserAuthDto } from './dto/sign-in.dto';
import { ErrorDto } from 'src/common/dto/error.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign in a user
   */
  @ApiOkResponse({
    description:
      'The user was authenticated successfully. The token needed to access protected routes is returned.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong username or password. The user was not authenticated.',
    type: ErrorDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: UserAuthDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  /**
   * Sign up a user
   */
  @ApiCreatedResponse({
    description:
      'The user was created successfully. The token needed to access protected routes is returned.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is already connected. The user was not created.',
    type: ErrorDto,
  })
  @ApiConflictResponse({
    description: 'The username already exists. The user was not created.',
    type: ErrorDto,
  })
  @Post('register')
  @Public()
  signUp(@Body() signInDto: UserAuthDto, @Req() req: AuthedRequest) {
    // Check if the user is already connected
    if (req.user) {
      throw new UnauthorizedException(
        'You are already connected. Please log out before signing up.',
      );
    }

    return this.authService.signUp(signInDto.username, signInDto.password);
  }

  /**
   * Get the profile of the authenticated user
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user profile data.',
    type: JwtUserDto,
  })
  @Get('profile')
  getProfile(@Req() req: AuthedRequest) {
    return req.user;
  }
}
