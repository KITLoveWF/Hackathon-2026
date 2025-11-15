import {QuestionType} from '../enum/question.enum';

export class QuestionDto {
  id: string;
  chatBoxId: string;
  context: string;
  type: QuestionType;
}