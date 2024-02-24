import { Server, Socket } from "socket.io";

import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { ChatService } from "./chat.service";
import { MessageDto } from "./dto/message.dto";
import { RoomDto } from "./dto/room.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("ChatGateway");

  constructor(private readonly ChatService: ChatService) {}

  afterInit(server: any) {
    this.server.emit("connection", "connected");
    this.logger.log("Initialized!");
  }

  @SubscribeMessage("room-message")
  async handleMessage(@MessageBody() dto: MessageDto) {
    console.log(dto);
    this.server.to(dto.roomId).emit("message", dto);
    this.ChatService.createMessage(dto);
  }

  @SubscribeMessage("create-room")
  async createRoom(@MessageBody() dto: RoomDto) {
    console.log("OK");
    const room_response = await this.ChatService.createRoom(dto);

    const data = {
      id: room_response.id,
      messages: [],
      users: room_response.users,
    };

    console.log(data);

    this.server.emit("join-call", data);
  }

  @SubscribeMessage("join-room")
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody("roomIds") roomIds: string[]
  ) {
    console.log(roomIds);
    client.join(roomIds);
    this.server.emit("join", `client joinded ${client.id}`);
  }
}
