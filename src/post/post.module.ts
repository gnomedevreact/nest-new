import { PrismaService } from "db/prisma.service";

import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
