import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServersService } from './servers.service';
import { ServerDto } from './servers.dto';

@ApiTags('servers')
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @ApiOperation({
    operationId: 'findServer',
    description: 'return an online server with the lowest priority.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ServerDto,
    description: 'An online server',
  })
  @Get('')
  async findServer(): Promise<ServerDto> {
    return this.serversService.findServer();
  }
}
