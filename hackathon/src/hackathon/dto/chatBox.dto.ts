import {QuestionType} from '../enum/question.enum';

export class chatboxDto {
  id: string;
  ClassId: string;
  context: string;
  type: QuestionType;
  isActive: boolean;
  questions: any[];
}