import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HackathonService } from '../service/hackathon.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { QuestionDto } from '../dto/question.dto';
import { chatboxDto } from '../dto/chatBox.dto';
import { QuestionType } from '../enum/question.enum';

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

  @Get('chatbox_in_class/:classId')
  async getInClassChatbox(
    @Param('classId') classId: string,
  ) {
    return this.hackathonService.getChatboxByClassAndType(
      classId,
      QuestionType.IN_CLASS,
    ); 
  }

  @Get('chatbox_off_topic/:classId')
  async getOffTopicChatbox(
    @Param('classId') classId: string,
  ) {
    return this.hackathonService.getChatboxByClassAndType(
      classId,
      QuestionType.OFF_TOPIC,
    );
  }

  @Get('questions/:chatboxId')
  async getQuestionsByChatbox(
    @Param('chatboxId') chatboxId: string,
  ) {
    return this.hackathonService.getQuestionsByChatboxId(chatboxId);
  }
}