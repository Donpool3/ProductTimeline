import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Product Timeline API')
    .setDescription(
      'API for Product Timeline Web Application - Transform project documentation into interactive case studies',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for service-to-service authentication',
      },
      'API-Key',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Projects', 'Project management endpoints')
    .addTag('Timeline', 'Timeline and milestone endpoints')
    .addTag('Export', 'Export and sharing endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Backend server running on http://localhost:${port}`);
  logger.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check available at http://localhost:${port}/${apiPrefix}/health`);
  logger.log(`🔒 JWT authentication enabled`);
  logger.log(`🛡️  Rate limiting enabled (${process.env.RATE_LIMIT_MAX || 100} requests per ${process.env.RATE_LIMIT_WINDOW_MS || 60000}ms)`);
  logger.log(`🌐 CORS enabled for: ${corsOrigins.join(', ')}`);
}

bootstrap();
