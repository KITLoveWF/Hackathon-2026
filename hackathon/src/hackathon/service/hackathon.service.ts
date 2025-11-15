import { Injectable } from '@nestjs/common';

@Injectable()
export class HackathonService {
  healthcheck(): { status: string; message: string; timestamp: string } {
    return {
      status: 'ok',
      message: 'Hackathon API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
