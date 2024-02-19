import { PrismaService } from "db/prisma.service";

import { Injectable, NotFoundException } from "@nestjs/common";

import { PostDto } from "./dto/post.dto";

@Injectable()
export class PostService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(userId: string, dto: PostDto) {
    try {
      const post = await this.PrismaService.post.create({
        data: {
          title: dto.title,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return post;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAll() {
    return await this.PrismaService.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const post = await this.PrismaService.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException("post was not found");
    }

    try {
      await this.PrismaService.post.delete({ where: { id } });

      return {
        message: "post was successfully deleted",
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
