import * as cookieParser from "cookie-parser";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: "https://next-f2fi5v216-gnomedevreact.vercel.app/",
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  await app.listen(port);
}
bootstrap();
