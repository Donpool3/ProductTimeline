import { Module, Global } from '@nestjs/common';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';

@Global()
@Module({
  providers: [RateLimitInterceptor],
  exports: [RateLimitInterceptor],
})
export class CommonModule {}
