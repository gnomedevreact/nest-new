import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 7000;

  dotenv.config();

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  await app.listen(port);
}
bootstrap();
