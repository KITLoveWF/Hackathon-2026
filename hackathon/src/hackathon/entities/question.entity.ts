import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Chatbox } from './chatbox.entity';
import { QuestionType } from '../enum/question.enum';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chatbox)
  @JoinColumn({ name: 'chatboxId' })
  chatbox: Chatbox;

  @Column({ type: 'uuid' })
  chatboxId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.IN_CLASS,
  })
  type: QuestionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
