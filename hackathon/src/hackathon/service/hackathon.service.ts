import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto, dto_converter } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';

@Injectable()
export class HackathonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

      const accessTokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role.name,
      };
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: '5m',
      });

      const refreshTokenPayload = { sub: user.id };
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      });

      const userData = dto_converter({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      });

      return {
        success: true,
        data: {
          accesssToken: accessToken,
          refreshToken: refreshToken,
          User: userData,
        },
        error: null,
      };
    } catch (error) {
      throw error;
    }
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
}
