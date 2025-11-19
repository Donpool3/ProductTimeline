import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthCheckResult, DependencyHealth } from './dto/health-check.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async check(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async detailedCheck(): Promise<HealthCheckResult> {
    const dependencies: DependencyHealth[] = [];

    // Check database
    const dbHealth = await this.checkDatabase();
    dependencies.push(dbHealth);

    // Determine overall status
    const hasError = dependencies.some((dep) => dep.status === 'error');
    const hasWarning = dependencies.some((dep) => dep.status === 'warning');
    
    let status: 'ok' | 'warning' | 'error' = 'ok';
    if (hasError) {
      status = 'error';
    } else if (hasWarning) {
      status = 'warning';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      dependencies,
    };
  }

  private async checkDatabase(): Promise<DependencyHealth> {
    try {
      const startTime = Date.now();
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;

      return {
        name: 'database',
        status: 'ok',
        responseTime,
        message: 'Database connection is healthy',
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        name: 'database',
        status: 'error',
        message: error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }
}
