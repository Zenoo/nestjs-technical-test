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
import { UserRole } from '@prisma/client';
import { AuthedRequest } from '../auth/dto/sign-in.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { isAdmin } from '../common/guards/roles.guard';
import { UserCreateDto, UserUpdateDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  create(@Body() data: UserCreateDto) {
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const user = await this.usersService.findOne(uuid);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

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
