import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('welcome', () => {
    it('should return welcome message', () => {
      const result = appController.getWelcome();
      expect(result).toHaveProperty('message', 'Product Timeline API');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('documentation', '/api/docs');
      expect(result).toHaveProperty('health', '/api/v1/health');
    });
  });
});
