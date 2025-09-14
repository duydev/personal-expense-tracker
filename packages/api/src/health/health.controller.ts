import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Health check successful.',
    example: { status: 'ok', timestamp: '2023-10-05T12:34:56Z', uptime: 12345 },
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}
