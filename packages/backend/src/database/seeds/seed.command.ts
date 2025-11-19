import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  const command = process.argv[2];

  try {
    switch (command) {
      case 'seed':
        await seedService.seedDatabase();
        break;
      case 'clear':
        await seedService.clearDatabase();
        break;
      case 'reset':
        await seedService.clearDatabase();
        await seedService.seedDatabase();
        break;
      default:
        console.log('Usage: npm run seed [seed|clear|reset]');
        console.log('  seed  - Add sample data to database');
        console.log('  clear - Remove all data from database');
        console.log('  reset - Clear and re-seed database');
    }
  } catch (error) {
    console.error('Error running seed command:', error);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();
