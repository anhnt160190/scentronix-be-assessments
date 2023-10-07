import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServersModule } from './servers/servers.module';

@Module({
  imports: [ServersModule],
  controllers: [AppController],
})
export class AppModule {}
