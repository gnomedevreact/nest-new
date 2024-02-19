import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/user/decorators/user.decorator";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { PostDto } from "./dto/post.dto";
import { PostService } from "./post.service";

@Controller("posts")
export class PostController {
  constructor(private readonly PostService: PostService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("create")
  async create(@Body() dto: PostDto, @CurrentUser("id") userId: string) {
    return this.PostService.create(userId, dto);
  }

  @Auth()
  @Get("get-all")
  async getAll() {
    return this.PostService.getAll();
  }

  @Auth()
  @Delete("delete/:id")
  async delete(@Param("id") id: string) {
    return this.PostService.delete(id);
  }
}
