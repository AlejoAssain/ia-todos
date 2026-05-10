import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Test the configured AI provider',
    description:
      'Runs a minimal AI request and returns the generated response. Use this endpoint as a quick smoke test for the current IA_PROVIDER configuration.',
  })
  @ApiOkResponse({
    description: 'AI provider responded successfully.',
    schema: {
      type: 'string',
      example: 'Hello! How can I help you today?',
    },
  })
  getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
