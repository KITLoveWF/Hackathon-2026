import { Controller, Get, Post, Body } from '@nestjs/common';
import { HackathonService } from '../service/hackathon.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';

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
  @Get('classrooms/:teacherId')
  async getClassroomById(teacherId: string): Promise<any> {
    return this.hackathonService.getClassroomById(teacherId);
  }
  @Get('student/classrooms/:studentId')
  async getStudentClassrooms(studentId: string): Promise<any> {
    return this.hackathonService.getStudentClassrooms(studentId);
  }
}
