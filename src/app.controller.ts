import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @ApiOperation({
    operationId: 'ping',
    description: 'Health check endpoint',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
  })
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
