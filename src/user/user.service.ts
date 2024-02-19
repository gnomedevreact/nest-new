import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../db/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly PrismaService: PrismaService) {}

  async byId(userId: string) {
    return await this.PrismaService.user.findUnique({ where: { id: userId } });
  }

  async getAll() {
    return await this.PrismaService.user.findMany({
      select: {
        id: true,
        email: true,
        posts: true,
        isAdmin: true,
        rooms: true,
      },
      orderBy: { id: "asc" },
    });
  }
}
