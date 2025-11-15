import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';
import { Role } from '../entities/role.entity';
import { Chatbox } from '../entities/chatbox.entity';
import { Class } from '../entities/class.entity';
import { Upvote } from '../entities/upvote.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE,
  entities: [User, Question, Role, Chatbox, Class, Upvote],
  migrations: ['src/hackathon/utils/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
