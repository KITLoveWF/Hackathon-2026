import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HackathonService } from './service/hackathon.service';
import { HackathonController } from './controller/hackathon.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Class } from './entities/class.entity';
import { Chatbox } from './entities/chatbox.entity';
import { Question } from './entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Class, Chatbox, Question])],
  providers: [HackathonService],
  controllers: [HackathonController],
})
export class HackathonModule {}
