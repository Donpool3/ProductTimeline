import { ApiProperty } from '@nestjs/swagger';

export class DependencyHealth {
  @ApiProperty({ example: 'database' })
  name: string;

  @ApiProperty({ example: 'ok', enum: ['ok', 'warning', 'error'] })
  status: 'ok' | 'warning' | 'error';

  @ApiProperty({ example: 15, required: false })
  responseTime?: number;

  @ApiProperty({ example: 'Database connection is healthy' })
  message: string;
}

export class HealthCheckResult {
  @ApiProperty({ example: 'ok', enum: ['ok', 'warning', 'error'] })
  status: 'ok' | 'warning' | 'error';

  @ApiProperty({ example: '2025-11-19T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 3600.5 })
  uptime: number;

  @ApiProperty({ example: '1.0.0' })
  version: string;

  @ApiProperty({ type: [DependencyHealth], required: false })
  dependencies?: DependencyHealth[];
}
