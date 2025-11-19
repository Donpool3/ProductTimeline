import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      message: 'Product Timeline API',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/api/v1/health',
      description: 'Transform project documentation into interactive case studies',
    };
  }
}
