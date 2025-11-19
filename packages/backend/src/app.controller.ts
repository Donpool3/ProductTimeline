import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get API welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message with API information',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product Timeline API' },
        version: { type: 'string', example: '1.0.0' },
        documentation: { type: 'string', example: '/api/docs' },
        health: { type: 'string', example: '/api/v1/health' },
      },
    },
  })
  getWelcome() {
    return this.appService.getWelcome();
  }
}
