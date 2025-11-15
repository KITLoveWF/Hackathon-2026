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
import { User } from './user.entity';
import { Chatbox } from './chatbox.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  classCode: string;

  @Column({ type: 'varchar', length: 255 })
  className: string;

  @Column({ type: 'varchar', length: 255 })
  scheduleTime: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column({ type: 'uuid' })
  teacherId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Chatbox, (chatbox) => chatbox.class)
  chatboxes: Chatbox[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
