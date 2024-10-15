import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerInit from './swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(options);

  // Swagger
  await swaggerInit(app);
  // set port, listen for requests
  const PORT = process.env.NODE_DOCKER_PORT ?? 3000;
  await app.listen(PORT, () => {
    Logger.log(`Server is running on port ${PORT}.`);
  });
}
bootstrap();
