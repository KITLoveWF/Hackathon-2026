import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Question } from './question.entity';
import { QuestionType } from '../enum/question.enum';

@Entity('chatboxes')
export class Chatbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ type: 'uuid' })
  classId: string;

  @Column({
      type: 'enum',
      enum: QuestionType,
      default: QuestionType.IN_CLASS,
    })
  type: QuestionType;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Question, (question) => question.chatbox)
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
