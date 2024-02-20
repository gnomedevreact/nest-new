import * as cookieParser from "cookie-parser";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 7000;

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: "https://next-new-nu.vercel.app",
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  await app.listen(port);
}
bootstrap();
