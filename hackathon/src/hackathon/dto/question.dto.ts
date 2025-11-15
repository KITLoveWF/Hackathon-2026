import {QuestionType} from '../enum/question.enum';

export class QuestionDto {
  chatBoxId: string;
  context: string;
  type: QuestionType;
}