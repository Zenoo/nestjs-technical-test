import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthedRequest } from 'src/auth/dto/sign-in.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { isAdmin } from 'src/common/guards/roles.guard';
import { UserCreateDto, UserUpdateDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles([UserRole.ADMIN])
  @Post()
  create(@Body() data: UserCreateDto) {
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() data: UserUpdateDto,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    // If the user is not an admin, they can only update their own user
    if (uuid !== request.user.id && !admin) {
      throw new Error('Unauthorized');
    }

    // Roles can only be updated by admins
    if (data.roles && !admin) {
      throw new Error('Unauthorized');
    }

    return this.usersService.update(uuid, data);
  }

  @Delete(':uuid')
  @Roles([UserRole.ADMIN])
  remove(@Param('uuid') uuid: string, @Req() request: AuthedRequest) {
    // Prevent admins from deleting themselves
    if (uuid === request.user.id) {
      throw new Error('Unauthorized');
    }

    return this.usersService.remove(uuid);
  }
}
