import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Inject,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store: RateLimitStore = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(@Optional() private configService?: ConfigService) {
    this.maxRequests = this.configService?.get<number>('RATE_LIMIT_MAX') || 100;
    this.windowMs = this.configService?.get<number>('RATE_LIMIT_WINDOW_MS') || 60000; // 1 minute
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup(now);

    // Get or create rate limit entry
    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }

    const entry = this.store[key];

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.windowMs;
    }

    // Check rate limit
    if (entry.count >= this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    entry.count++;

    // Add rate limit headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', this.maxRequests);
    response.setHeader('X-RateLimit-Remaining', this.maxRequests - entry.count);
    response.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    return next.handle();
  }

  private getKey(request: any): string {
    // Use IP address or user ID if authenticated
    const userId = request.user?.userId;
    const ip = request.ip || request.connection.remoteAddress;
    return userId || ip;
  }

  private cleanup(now: number): void {
    // Remove expired entries to prevent memory leak
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime + this.windowMs) {
        delete this.store[key];
      }
    });
  }
}
