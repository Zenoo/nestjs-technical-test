import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthedRequest } from '../auth/dto/sign-in.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { isAdmin } from '../common/guards/roles.guard';
import { UserCreateDto, UserDto, UserUpdateDto } from './users.dto';
import { UsersService } from './users.service';
import { ErrorDto } from 'src/common/dto/error.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user (admin only)
   */
  @ApiCreatedResponse({
    description:
      'The user was created successfully. The created user data is also returned.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not an admin',
    type: ErrorDto,
  })
  @Post()
  @Roles([UserRole.ADMIN])
  create(@Body() data: UserCreateDto) {
    return this.usersService.create(data);
  }

  /**
   * Get all users (admin only)
   */
  @ApiOkResponse({
    description: 'An array of users.',
    type: UserDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not an admin',
    type: ErrorDto,
  })
  @Get()
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Get a specific user from its UUID
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'The requested user data.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user was not found.',
    type: ErrorDto,
  })
  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const user = await this.usersService.findOne(uuid);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Update a user
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'The user was updated successfully. The updated user data is also returned.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'The user does not have permission to update this user or is trying to update their roles without being an admin',
    type: ErrorDto,
  })
  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: UserUpdateDto,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    // If the user is not an admin, they can only update their own user
    if (uuid !== request.user.id && !admin) {
      throw new UnauthorizedException();
    }

    // Roles can only be updated by admins
    if (data.roles && !admin) {
      throw new UnauthorizedException();
    }

    return this.usersService.update(uuid, data);
  }

  /**
   * Delete a user (admin only)
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'The user was deleted successfully. The deleted user data is also returned.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'The user is either not an admin or trying to delete themselves',
    type: ErrorDto,
  })
  @Delete(':uuid')
  @Roles([UserRole.ADMIN])
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthedRequest,
  ) {
    // Prevent admins from deleting themselves
    if (uuid === request.user.id) {
      throw new UnauthorizedException();
    }

    return this.usersService.remove(uuid);
  }
}
