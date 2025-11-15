import { Controller, Get, Post, Body } from '@nestjs/common';
import { HackathonService } from '../service/hackathon.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { QuestionDto } from '../dto/question.dto';

export type AuthErrorKind =
  | 'auth_invalid_credentials'
  | 'auth_Invalid_refresh_TOken';

@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Get('healthcheck')
  healthcheck(): { status: string; message: string; timestamp: string } {
    return this.hackathonService.healthcheck();
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDTO> {
    return this.hackathonService.login(loginDto);
  }

  @Post('send-message')
  async sendMessage(@Body() questionDto: QuestionDto): Promise<any> {
    // You can add logic here to handle the message, e.g., broadcast it using WebSocket
    return this.hackathonService.addQuestion(questionDto);
  }
}