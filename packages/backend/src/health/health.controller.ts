import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../common/decorators/public.decorator';
import { HealthCheckResult } from './dto/health-check.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    type: HealthCheckResult,
  })
  async check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }

  @Public()
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with dependencies' })
  @ApiResponse({
    status: 200,
    description: 'Detailed health status',
    type: HealthCheckResult,
  })
  async detailedCheck(): Promise<HealthCheckResult> {
    return this.healthService.detailedCheck();
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({
    status: 200,
    description: 'Service is ready to accept traffic',
  })
  async ready(): Promise<{ status: string }> {
    const health = await this.healthService.check();
    return { status: health.status };
  }

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
  })
  live(): { status: string } {
    return { status: 'ok' };
  }
}
