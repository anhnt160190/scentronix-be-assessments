import { Test, TestingModule } from '@nestjs/testing';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

describe('ServersController', () => {
  let serversController: ServersController;
  let serversService: ServersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ServersService],
      controllers: [ServersController],
    })
      .overrideProvider(ServersService)
      .useValue({})
      .compile();
    serversController = app.get<ServersController>(ServersController);
    serversService = app.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(serversController).toBeDefined();
  });

  describe('findServer', () => {
    it('should call to serversService.findServer', async () => {
      serversService.findServer = jest.fn();
      await serversController.findServer();
      expect(serversService.findServer).toBeCalled();
    });
  });
});
