import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorator/public.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * A simple hello world endpoint
   */
  @ApiOkResponse({
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: 'Hello World!',
        },
      },
    },
  })
  @Get()
  @Public()
  getHello() {
    return this.appService.getHello();
  }
}
