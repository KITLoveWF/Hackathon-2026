import { Controller, Get } from '@nestjs/common';
import { HackathonService } from '../service/hackathon.service';

@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Get('healthcheck')
  healthcheck(): { status: string; message: string; timestamp: string } {
    return this.hackathonService.healthcheck();
  }
}
