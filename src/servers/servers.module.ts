import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [HttpModule],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
