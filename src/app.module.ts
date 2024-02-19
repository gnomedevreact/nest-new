import { PrismaService } from "db/prisma.service";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ChatGateway } from "./chat/chat.gateway";
import { ChatModule } from "./chat/chat.module";
import { ChatService } from "./chat/chat.service";
import { PostModule } from "./post/post.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PostModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService, PrismaService],
})
export class AppModule {}
