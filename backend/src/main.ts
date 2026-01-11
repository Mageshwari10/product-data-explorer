import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const port = Number(process.env.PORT) || 3001;
    await app.listen(port, '0.0.0.0');

    console.log(`Application running on port ${port}`);
}
bootstrap();
