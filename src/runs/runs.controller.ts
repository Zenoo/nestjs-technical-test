import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RunsService } from './runs.service';
import { Prisma, UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('runs')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Post()
  create(@Body() data: Prisma.RunCreateInput) {
    return this.runsService.create(data);
  }

  @Get()
  findAll() {
    return this.runsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.runsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() data: Prisma.RunUpdateInput) {
    return this.runsService.update(uuid, data);
  }

  @Delete(':uuid')
  @Roles([UserRole.ADMIN])
  remove(@Param('uuid') uuid: string) {
    return this.runsService.remove(uuid);
  }
}
