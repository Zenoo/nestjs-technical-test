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
import { RunCreateDto, RunUpdateDto } from './runs.dto';
import { RunsService } from './runs.service';

@Controller('runs')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Post()
  create(@Body() data: RunCreateDto, @Req() request: AuthedRequest) {
    return this.runsService.create(request.user.id, data);
  }

  @Get()
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.runsService.findAll();
  }

  @Get()
  findOwn(@Req() request: AuthedRequest) {
    return this.runsService.findOwn(request.user.id);
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new Error('Run not found');
    }

    // If the user is not an admin, they can only view their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new Error('Unauthorized');
    }

    return run;
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: RunUpdateDto,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new Error('Run not found');
    }

    // If the user is not an admin, they can only update their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new Error('Unauthorized');
    }

    return this.runsService.update(uuid, data);
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new Error('Run not found');
    }

    // If the user is not an admin, they can only delete their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new Error('Unauthorized');
    }

    return this.runsService.remove(uuid);
  }
}
