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

  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(port);
}
bootstrap();
