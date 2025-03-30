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
import { RunCreateDto, RunDto, RunUpdateDto } from './runs.dto';
import { RunsService } from './runs.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/common/dto/error.dto';

@ApiBearerAuth()
@Controller('runs')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  /**
   * Create a new run
   */
  @ApiCreatedResponse({
    description:
      'The run was created successfully. The created run data is also returned.',
    type: RunDto,
  })
  @Post()
  create(@Body() data: RunCreateDto, @Req() request: AuthedRequest) {
    return this.runsService.create(request.user.id, data);
  }

  /**
   * Get all runs (admin only)
   */
  @ApiOkResponse({
    description: 'An array of runs.',
    type: RunDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not an admin',
    type: ErrorDto,
  })
  @Get('all')
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.runsService.findAll();
  }

  /**
   * Get the authenticated user's runs
   */
  @ApiOkResponse({
    description: 'An array of runs.',
    type: RunDto,
    isArray: true,
  })
  @Get()
  findOwn(@Req() request: AuthedRequest) {
    return this.runsService.findOwn(request.user.id);
  }

  /**
   * Get a specific run from its UUID
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the run',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'The requested run data.',
    type: RunDto,
  })
  @ApiNotFoundResponse({
    description: 'The run was not found.',
    type: ErrorDto,
  })
  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new NotFoundException();
    }

    // If the user is not an admin, they can only view their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new UnauthorizedException();
    }

    return run;
  }

  /**
   * Update a specific run
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the run',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'The run was updated successfully. The updated run data is also returned.',
    type: RunDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The user does not have permission to update this run',
    type: ErrorDto,
  })
  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: RunUpdateDto,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new NotFoundException();
    }

    // If the user is not an admin, they can only update their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new UnauthorizedException();
    }

    return this.runsService.update(uuid, data);
  }

  /**
   * Delete a specific run
   */
  @ApiParam({
    name: 'uuid',
    description: 'The UUID of the run',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'The run was deleted successfully. The deleted run data is also returned.',
    type: RunDto,
  })
  @ApiNotFoundResponse({
    description: 'The run was not found.',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'The user is either not an admin or trying to delete a run that does not belong to them',
    type: ErrorDto,
  })
  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthedRequest,
  ) {
    const admin = isAdmin(request.user);
    const run = await this.runsService.findOne(uuid);

    if (!run) {
      throw new NotFoundException();
    }

    // If the user is not an admin, they can only delete their own runs
    if (run.userId !== request.user.id && !admin) {
      throw new UnauthorizedException();
    }

    return this.runsService.remove(uuid);
  }
}
