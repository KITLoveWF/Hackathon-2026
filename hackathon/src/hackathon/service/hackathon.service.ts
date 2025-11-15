import 'dotenv/config';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Class } from '../entities/class.entity';
import { Question } from '../entities/question.entity';
import { Chatbox } from '../entities/chatbox.entity';
import { Upvote } from '../entities/upvote.entity';
import { LoginDto, dto_converter } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { QuestionDto } from '../dto/question.dto';
import { stat } from 'fs';
import { QuestionType } from '../enum/question.enum';
import { WsGateway } from '../../gateway/ws.gateway';

@Injectable()
export class HackathonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly jwtService: JwtService,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Chatbox)
    private readonly chatboxRepository: Repository<Chatbox>,
    @Inject(forwardRef(() => WsGateway))
    private readonly wsGateway: WsGateway,
    @InjectRepository(Upvote)
    private readonly upvoteRepository: Repository<Upvote>,
  ) {}

  healthcheck(): { status: string; message: string; timestamp: string } {
    return {
      status: 'ok',
      message: 'Hackathon API is running',
      timestamp: new Date().toISOString(),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDTO> {
    try {
      this._validateLoginInput(loginDto);
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        relations: ['role'],
      });
      await this._validateUser(user, loginDto.password);

      if (!user) {
        this._handleExceptionError('User not found', 401);
      }

      const userData = dto_converter({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      });

      return {
        success: true,
        data: {
          User: userData,
        },
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }
  async getClassroomById(teacherId: string): Promise<any> {
    try {
      if (!teacherId) {
        this._handleExceptionError('ID không được để trống', 400);
      }
      const classroom = await this.classRepository.find({
        where: { teacherId: teacherId },
      });
      return classroom;
    } catch (error) {
      throw error;
    }
  }
  async getStudentClassrooms(studentId: string): Promise<any> {
    try {
      if (!studentId) {
        this._handleExceptionError('ID không được để trống', 400);
      }
      const classrooms = await this.classRepository
        .createQueryBuilder('classes')
        .innerJoin('student_classes', 'sc', 'sc.classId = classes.id')
        .innerJoin('users', 'teacher', 'teacher.id = classes.teacherId')
        .where('sc.userId = :studentId', { studentId })
        .select([
          'classes.id',
          'classes.className',
          'classes.scheduleTime',
          'teacher.fullName',
        ])
        .getRawMany();
      return classrooms;
    } catch (error) {
      throw error;
    }
  }
  async logout(): Promise<AuthResponseDTO> {
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  private _validateLoginInput(loginDto: LoginDto): void {
    if (!loginDto.email || !loginDto.password) {
      this._handleExceptionError('Email và password không được để trống', 400);
    }
  }

  private async _validateUser(
    user: User | null,
    password: string,
  ): Promise<void> {
    if (!user) {
      this._handleExceptionError('Email hoặc password không chính xác', 401);
    }

    if (!user) return;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      this._handleExceptionError('Email hoặc password không chính xác', 401);
    }

    if (!user.isActive) {
      this._handleExceptionError('Tài khoản của bạn đã bị khóa', 401);
    }
  }

  private _handleExceptionError(message: string, statusCode: number): never {
    throw new HttpException(message, statusCode);
  }

  // Add question
  async addQuestion(questionDto: QuestionDto): Promise<any> {
    const { chatBoxId, context, type } = questionDto;
    const n8n_response = await this.fetchData(context);
    if (n8n_response.status === 'success') {
      try {
        const newQuestion = await this.addQuestionInDB(questionDto);
        
        // Lấy thông tin chatbox để có classroomId
        const chatbox = await this.chatboxRepository.findOne({
          where: { id: chatBoxId },
        });
        
        if (chatbox) {
          // Broadcast tin nhắn mới qua WebSocket
          const roomName = `${chatbox.classId}-${type}`;
          this.wsGateway.broadcastToRoom(roomName, 'messageReceived', {
            id: newQuestion.id,
            content: newQuestion.content,
            type: newQuestion.type,
            createdAt: newQuestion.createdAt,
            chatboxId: newQuestion.chatboxId,
          });
        }
      } catch (error) {
        throw new HttpException(
          'Failed to add question to the database',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return n8n_response;
  }

  // fetch service from n8n
  async fetchData(question: string): Promise<any> {
    const n8n_domain = process.env.N8N_DOMAIN || 'http://localhost:5678';
    const res = await fetch(
      n8n_domain +
        '/webhook/check-message/b0cf2a70-0237-4da5-9544-77a1c21a07cb?question=' +
        question,
      {
        method: 'GET',
      },
    );
    return await res.json();
  }

  async addQuestionInDB (questionDto: QuestionDto): Promise<Question> 
 {
    const question = this.questionRepository.create({
      chatboxId: questionDto.chatBoxId,
      content: questionDto.context,
      type: questionDto.type,
    });
    return await this.questionRepository.save(question);
  }

  async getChatboxByClassAndType(classId: string, type: QuestionType) {
    const chatboxes = await this.chatboxRepository.findOne({
      where: {
        classId: classId,
        type: type,
        isActive: true,
      },
      relations: ['class'], // nếu bạn muốn load class kèm theo
    });
    console.log('chatboxes: ', chatboxes);
    return {
      success: true,
      data: chatboxes,
    };
  }

  async getQuestionsByChatboxId(chatboxId: string) {
    const questions = await this.questionRepository.find({
      where: {
        chatboxId: chatboxId,
      },
      relations: ['upvotes'],
      order: {
        createdAt: 'ASC',
      },
    });

    const questionsWithUpvotes = questions.map((question) => ({
      ...question,
      upvoteCount: question.upvotes?.length || 0,
      upvotes:
        question.upvotes?.map((upvote) => ({
          userId: upvote.userId,
        })) || [],
    }));

    return {
      success: true,
      data: questionsWithUpvotes,
    };
  }

  async changeChatboxStatus(
    chatboxId: string,
    isActive: boolean,
  ){
    return await this.chatboxRepository.update(chatboxId, { 
      isActive: isActive 
    });
  }
  async upvoteQuestion(questionId: string, userId: string): Promise<any> {
    try {
      if (!questionId || !userId) {
        this._handleExceptionError(
          'Question ID và User ID không được để trống',
          400,
        );
      }

      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this._handleExceptionError('Câu hỏi không tồn tại', 404);
      }

 
      const existingUpvote = await this.upvoteRepository.findOne({
        where: { questionId, userId },
      });


      if (existingUpvote) {
        return {
          success: true,
          data: { message: 'Bạn đã upvote câu hỏi này rồi' },
          error: null,
        };
      }
      const upvote = this.upvoteRepository.create({
        questionId,
        userId,
      });

      await this.upvoteRepository.save(upvote);

      return {
        success: true,
        data: { message: 'Upvote thành công' },
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeUpvote(questionId: string, userId: string): Promise<any> {
    try {
      if (!questionId || !userId) {
        this._handleExceptionError(
          'Question ID và User ID không được để trống',
          400,
        );
      }

      const upvote = await this.upvoteRepository.findOne({
        where: { questionId, userId },
      });

      if (!upvote) {
      
        return {
          success: true,
          data: { message: 'Upvote đã được xóa hoặc không tồn tại' },
          error: null,
        };
      }

      await this.upvoteRepository.remove(upvote);

      return {
        success: true,
        data: { message: 'Xóa upvote thành công' },
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTotalQuestionsByClassroomByWeek(classroomId: string): Promise<any> {
    const result = await this.questionRepository
      .createQueryBuilder('questions')
      .innerJoin('chatboxes', 'chatboxes', 'questions.chatboxId = chatboxes.id')
      .where('chatboxes.classId = :classroomId', { classroomId })
      .andWhere('questions.createdAt >= NOW() - INTERVAL \'7 days\'')
      .getCount();
    return result;
  }
  async getTotalQuestionsByClassroomByLastWeek(classroomId: string): Promise<any> {
    const result = await this.questionRepository
      .createQueryBuilder('questions')
      .innerJoin('chatboxes', 'chatboxes', 'questions.chatboxId = chatboxes.id')
      .where('chatboxes.classId = :classroomId', { classroomId })
      .andWhere('questions.createdAt >= NOW() - INTERVAL \'14 days\'')
      .andWhere('questions.createdAt < NOW() - INTERVAL \'7 days\'')
      .getCount();
    return result;
  }
  async getTotalQuestionsByClassroomByMonth(classroomId: string): Promise<any> {
    const result = await this.questionRepository
      .createQueryBuilder('questions')
      .innerJoin('chatboxes', 'chatboxes', 'questions.chatboxId = chatboxes.id')
      .where('chatboxes.classId = :classroomId', { classroomId })
      .andWhere('questions.createdAt >= NOW() - INTERVAL \'30 days\'')
      .getCount();
    return result;
  }
  async getTotalQuestionsByClassroomByLastMonth(classroomId: string): Promise<any> {
    const result = await this.questionRepository
      .createQueryBuilder('questions')
      .innerJoin('chatboxes', 'chatboxes', 'questions.chatboxId = chatboxes.id')
      .where('chatboxes.classId = :classroomId', { classroomId })
      .andWhere('questions.createdAt >= NOW() - INTERVAL \'60 days\'')
      .andWhere('questions.createdAt < NOW() - INTERVAL \'30 days\'')
      .getCount();
    return result;
  }
}
