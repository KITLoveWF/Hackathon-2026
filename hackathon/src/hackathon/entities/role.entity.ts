import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // 'STUDENT', 'TEACHER', 'ADMIN'

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user: User) => user.role)
  users: User[];
}
