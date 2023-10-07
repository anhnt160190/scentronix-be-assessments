import { HttpModule, HttpService } from '@nestjs/axios';
import { ServersService } from './servers.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('ServersService', () => {
  let serversService: ServersService;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HttpService, ServersService],
    })
      .overrideProvider(HttpService)
      .useValue({ axiosRef: {} })
      .compile();
    serversService = app.get<ServersService>(ServersService);
    httpService = app.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(serversService).toBeDefined();
  });

  describe('findServer', () => {
    it('should return onlineServer with the lowest priority', async () => {
      httpService.axiosRef.get = jest
        .fn()
        .mockReturnValue({ status: HttpStatus.OK });
      serversService.getAllServers = jest.fn().mockReturnValue([
        { url: 'https://example.com', priority: 1 },
        { url: 'https://example2.com', priority: 2 },
      ]);
      const result = await serversService.findServer();
      expect(result).toEqual({ url: 'https://example.com', priority: 1 });
    });

    it('should throw NotFoundException if no online server', async () => {
      httpService.axiosRef.get = jest.fn().mockRejectedValue({
        status: HttpStatus.BAD_GATEWAY,
        message: 'BAD_GATEWAY',
      });
      serversService.getAllServers = jest.fn().mockReturnValue([
        { url: 'https://example.com', priority: 1 },
        { url: 'https://example2.com', priority: 2 },
      ]);
      let result;
      try {
        await serversService.findServer();
      } catch (error) {
        result = error;
      }
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.response).toEqual({
        code: 'NOT_FOUND',
        message: 'No available server',
      });
    });
  });

  describe('isOnlineServer', () => {
    it('should return true if status code from 200 to 299', async () => {
      httpService.axiosRef.get = jest
        .fn()
        .mockReturnValue({ status: HttpStatus.ACCEPTED });
      const result = await serversService.isOnlineServer({
        url: 'https://example.com',
        priority: 1,
      });
      expect(result).toBeTruthy();
    });

    it('should return false if status code out of 200-299', async () => {
      httpService.axiosRef.get = jest
        .fn()
        .mockReturnValue({ status: HttpStatus.BAD_GATEWAY });
      const result = await serversService.isOnlineServer({
        url: 'https://example.com',
        priority: 1,
      });
      expect(result).toBeFalsy();
    });

    it('should return false if axios call failed', async () => {
      httpService.axiosRef.get = jest.fn().mockRejectedValue({
        status: HttpStatus.BAD_GATEWAY,
        message: 'BAD_GATEWAY',
      });
      const result = await serversService.isOnlineServer({
        url: 'https://example.com',
        priority: 1,
      });
      expect(result).toBeFalsy();
    });
  });
});
