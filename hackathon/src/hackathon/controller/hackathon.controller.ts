import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HackathonService } from '../service/hackathon.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { QuestionDto } from '../dto/question.dto';
import { chatboxDto } from '../dto/chatBox.dto';
import { QuestionType } from '../enum/question.enum';

export type AuthErrorKind =
  | 'auth_invalid_credentials'
  | 'auth_Invalid_refresh_TOken';

@ApiTags('Hackathon')
@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Get('healthcheck')
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'API is running' })
  healthcheck(): { status: string; message: string; timestamp: string } {
    return this.hackathonService.healthcheck();
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDTO> {
    return this.hackathonService.login(loginDto);
  }
  @Get('classrooms/:teacherId')
  async getClassroomById(@Param('teacherId') teacherId: string): Promise<any> {
    return this.hackathonService.getClassroomById(teacherId);
  }
  @Get('student/classrooms/:studentId')
  async getStudentClassrooms(
    @Param('studentId') studentId: string,
  ): Promise<any> {
    return this.hackathonService.getStudentClassrooms(studentId);
  }

  @Post('send-message')
  async sendMessage(@Body() questionDto: QuestionDto): Promise<any> {
    return this.hackathonService.addQuestion(questionDto);
  }

  @Get('chatbox_in_class/:classId')
  async getInClassChatbox(@Param('classId') classId: string) {
    return this.hackathonService.getChatboxByClassAndType(
      classId,
      QuestionType.IN_CLASS,
    );
  }

  @Get('chatbox_off_topic/:classId')
  async getOffTopicChatbox(@Param('classId') classId: string) {
    return this.hackathonService.getChatboxByClassAndType(
      classId,
      QuestionType.OFF_TOPIC,
    );
  }

  @Get('questions/:chatboxId')
  async getQuestionsByChatbox(@Param('chatboxId') chatboxId: string) {
    return this.hackathonService.getQuestionsByChatboxId(chatboxId);
  }

  @Post('chatbox/change-is-active/:chatboxId/:isActive')
  async changeChatboxStatus(
    @Param('chatboxId') chatboxId: string,
    @Param('isActive') isActive: boolean,
  ) {
    return this.hackathonService.changeChatboxStatus(
      chatboxId,
      isActive,
    );
  }
  @Post('auth/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(): Promise<AuthResponseDTO> {
    return this.hackathonService.logout();
  }

  @Post('questions/:questionId/upvote')
  @ApiOperation({ summary: 'Upvote a question' })
  @ApiResponse({ status: 200, description: 'Upvote successful' })
  @ApiResponse({ status: 400, description: 'Bad request or already upvoted' })
  async upvoteQuestion(
    @Param('questionId') questionId: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.hackathonService.upvoteQuestion(questionId, body.userId);
  }

  // @Get('chatbox/:chatboxId/questions/sorted')
  // @ApiOperation({ summary: 'Get questions sorted by upvote count' })
  // @ApiResponse({ status: 200, description: 'Questions retrieved' })
  // async getQuestionsWithUpvotes(
  //   @Param('chatboxId') chatboxId: string,
  // ): Promise<any> {
  //   return this.hackathonService.getQuestionsWithUpvotes(chatboxId);
  // }

  @Delete('questions/:questionId/upvote/:userId')
  @ApiOperation({ summary: 'Remove upvote from question' })
  @ApiResponse({ status: 200, description: 'Upvote removed' })
  async removeUpvote(
    @Param('questionId') questionId: string,
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.hackathonService.removeUpvote(questionId, userId);
  }
}
