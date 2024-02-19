import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/user/decorators/user.decorator";

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { ChatService } from "./chat.service";
import { MessageDto } from "./dto/message.dto";
import { RoomDto } from "./dto/room.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("create-room")
  async createRoom(@Body() dto: RoomDto) {
    return this.ChatService.createRoom(dto);
  }

  @Auth()
  @Get("rooms")
  async getRooms(@CurrentUser("id") id: string) {
    return this.ChatService.getRooms(id);
  }

  @Auth()
  @Get("by-id/:id")
  async getById(@Param("id") id: string) {
    return this.ChatService.getById(id);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("message")
  async createMessage(@Body() dto: MessageDto) {
    return this.ChatService.createMessage(dto);
  }
}
