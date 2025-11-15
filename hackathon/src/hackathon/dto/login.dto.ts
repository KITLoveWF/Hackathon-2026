import { IsString, IsNotEmpty } from 'class-validator';
import { ValidateDTO } from './validate-user.dto';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export function dto_converter(user: ValidateDTO): {
  id: string;
  email: string;
  fullName: string;
  role: string;
} {
  if (!user.email) {
    throw new Error('Invalid data or sth idk');
  }
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}
