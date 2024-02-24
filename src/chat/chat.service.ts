import { Injectable } from "@nestjs/common";
import { withAccelerate } from "@prisma/extension-accelerate";

import { PrismaService } from "../../db/prisma.service";
import { MessageDto } from "./dto/message.dto";
import { RoomDto } from "./dto/room.dto";

@Injectable()
export class ChatService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createRoom(dto: RoomDto) {
    const room = await this.PrismaService.$extends(
      withAccelerate()
    ).room.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: dto.userIds,
            },
          },
        },
      },
      include: {
        users: true,
      },
      cacheStrategy: { swr: 60, ttl: 60 },
    });

    if (room) {
      return room;
    }

    const newRoom = await this.PrismaService.$extends(
      withAccelerate()
    ).room.create({
      data: {
        users: {
          connect: dto.userIds.map((userId) => ({ id: userId })),
        },
      },
      include: {
        users: true,
      },
    });

    return newRoom;
  }

  async getRooms(userId: string) {
    return await this.PrismaService.$extends(withAccelerate()).room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: true,
        users: true,
      },
      cacheStrategy: { swr: 60, ttl: 60 },
    });
  }

  async createMessage(dto: MessageDto) {
    try {
      const message = await this.PrismaService.$extends(
        withAccelerate()
      ).message.create({
        data: dto,
      });

      return message;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getById(id: string) {
    const room = await this.PrismaService.$extends(
      withAccelerate()
    ).room.findUnique({
      where: { id },
      include: { messages: true, users: true },
      cacheStrategy: { swr: 60, ttl: 60 },
    });

    return room;
  }
}
