import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../db/prisma.service";
import { MessageDto } from "./dto/message.dto";
import { RoomDto } from "./dto/room.dto";

@Injectable()
export class ChatService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createRoom(dto: RoomDto) {
    const room = await this.PrismaService.room.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: dto.userIds,
            },
          },
        },
      },
    });

    if (room) {
      return {
        id: room.id,
      };
    }

    const newRoom = await this.PrismaService.room.create({
      data: {
        users: {
          connect: dto.userIds.map((userId) => ({ id: userId })),
        },
      },
    });

    return {
      id: newRoom.id,
    };
  }

  async getRooms(userId: string) {
    return await this.PrismaService.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: true,
        users: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async createMessage(dto: MessageDto) {
    try {
      const message = await this.PrismaService.message.create({
        data: dto,
      });

      return message;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getById(id: string) {
    const room = await this.PrismaService.room.findUnique({
      where: { id },
      include: { messages: true, users: true },
    });

    return room;
  }
}
