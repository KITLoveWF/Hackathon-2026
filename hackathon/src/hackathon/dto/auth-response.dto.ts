import { AuthErrorKind } from '../controller/hackathon.controller';

export class AuthResponseData {
  User: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export type AuthResponseDTO = ResponseDTO<AuthResponseData, AuthErrorKind>;

export interface ResponseDTO<DataType, ErrorKind> {
  success: boolean;
  data: DataType | null;
  error: {
    message: string;
    code: ErrorKind;
    details: string | null;
  } | null;
}
