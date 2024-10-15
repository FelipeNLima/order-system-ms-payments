import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './PrismaHealthIndicator.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private health: PrismaHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.isHealthy('check');
  }
}
