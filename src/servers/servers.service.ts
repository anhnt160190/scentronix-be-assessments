import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as config from 'config';
import { IServer } from './servers.interface';
import { logger } from '../shared/logger';
import { ServerDto } from './servers.dto';

@Injectable()
export class ServersService {
  constructor(private readonly httpService: HttpService) {}

  async findServer(): Promise<ServerDto> {
    const servers = this.getAllServers();
    const serversIncludeIsOk = await Promise.all(
      servers.map(async (server) => {
        const isOk = await this.isOnlineServer(server);
        return {
          ...server,
          isOk,
        };
      }),
    );
    const onlineServers = serversIncludeIsOk.filter((server) => server.isOk);
    if (onlineServers.length === 0) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'No available server',
      });
    }
    const sortedOnlineServers = [...onlineServers].sort(
      (server1, server2) => server1.priority - server2.priority,
    );
    const { url, priority } = sortedOnlineServers[0];
    return { url, priority };
  }

  async isOnlineServer(server: IServer): Promise<boolean> {
    const timeout = config.get<number>('servers.timeout') || 5000;
    try {
      const { status: httpStatus } = await this.httpService.axiosRef.get(
        server.url,
        { timeout },
      );
      if (httpStatus >= 200 && httpStatus <= 299) return true;
      return false;
    } catch (error) {
      logger.error({ error, server }, 'CHECK_ONLINE_SERVER_FAILED');
      return false;
    }
  }

  getAllServers(): IServer[] {
    return [
      {
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      },
      {
        url: 'https://gitlab.com',
        priority: 4,
      },
      {
        url: 'http://app.scnt.me',
        priority: 3,
      },
      {
        url: 'https://offline.scentronix.com',
        priority: 2,
      },
    ];
  }
}
