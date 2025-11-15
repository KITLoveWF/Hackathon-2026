require('dotenv').config();
console.log('🔐 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log(
  'All env keys:',
  Object.keys(process.env).filter(
    (k) => k.startsWith('DB_') || k.startsWith('JWT_') || k === 'PORT',
  ),
);
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 10000);
}
bootstrap();
