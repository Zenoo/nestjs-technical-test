import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UsersService } from './users.service';
import { Prisma, UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
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
  update(@Param('uuid') uuid: string, @Body() data: Prisma.UserUpdateInput) {
    return this.usersService.update(uuid, data);
  }

  @Delete(':uuid')
  @Roles([UserRole.ADMIN])
  remove(@Param('uuid') uuid: string) {
    return this.usersService.remove(uuid);
  }
}
