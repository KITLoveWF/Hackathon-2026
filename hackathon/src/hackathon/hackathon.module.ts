import { Module } from '@nestjs/common';
import { HackathonService } from './service/hackathon.service';
import { HackathonController } from './controller/hackathon.controller';

@Module({
  providers: [HackathonService],
  controllers: [HackathonController],
})
export class HackathonModule {}
