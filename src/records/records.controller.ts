import { Controller, Get, ParseArrayPipe, Query, Req } from '@nestjs/common';
import { RecordsService } from './records.service';
import { AuthedRequest } from '../auth/dto/sign-in.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('own')
  getOwn(
    @Req() request: AuthedRequest,
    @Query('distances', new ParseArrayPipe({ items: Number, separator: ',' }))
    distances: number[],
  ) {
    return this.recordsService.getOwn(request.user.id, distances);
  }

  @Get()
  getAll(
    @Query('distances', new ParseArrayPipe({ items: Number, separator: ',' }))
    distances: number[],
  ) {
    return this.recordsService.getTop(distances);
  }
}
