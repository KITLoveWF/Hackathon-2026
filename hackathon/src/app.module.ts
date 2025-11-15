import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HackathonModule } from './hackathon/hackathon.module';

@Module({
  imports: [HackathonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
