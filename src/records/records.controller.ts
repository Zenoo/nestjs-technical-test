import { Controller, Get, ParseArrayPipe, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AuthedRequest } from '../auth/dto/sign-in.dto';
import { RecordsService } from './records.service';

@ApiBearerAuth()
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  /**
   * Get the fastest runs for the authenticated user
   */
  @ApiQuery({
    name: 'distances',
    type: String,
    description: 'A comma-separated list of distances to filter the records by',
    required: true,
    example: '5,10,21',
  })
  @ApiOkResponse({
    description: 'The fastest runs for the authenticated user.',
    schema: {
      example: {
        5: [
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
        ],
        10: [
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
        ],
      },
    },
  })
  @Get('own')
  getOwn(
    @Req() request: AuthedRequest,
    @Query('distances', new ParseArrayPipe({ items: Number, separator: ',' }))
    distances: number[],
  ) {
    return this.recordsService.getOwn(request.user.id, distances);
  }

  /**
   * Get the fastest runs for all users
   * @param distances The distances to filter the records by (eg. 5, 10, 21)
   */
  @ApiQuery({
    name: 'distances',
    type: String,
    description: 'A comma-separated list of distances to filter the records by',
    required: true,
    example: '5,10,21',
  })
  @ApiOkResponse({
    description: 'The fastest runs for the authenticated user.',
    schema: {
      example: {
        5: [
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
        ],
        10: [
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
          {
            runId: '123e4567-e89b-12d3-a456-426614174000',
            time: 150000,
            distance: 5,
            averagePace: 300,
          },
        ],
      },
    },
  })
  @Get()
  getAll(
    @Query('distances', new ParseArrayPipe({ items: Number, separator: ',' }))
    distances: number[],
  ) {
    return this.recordsService.getTop(distances);
  }
}
