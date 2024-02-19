import * as argon2 from "argon2";
import { PrismaService } from "db/prisma.service";
import { Response } from "express";

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = "refreshToken";

  constructor(
    private readonly PrismaService: PrismaService,
    private readonly JwtService: JwtService
  ) {}

  async register(dto: AuthDto) {
    const isExist = await this.PrismaService.user.findFirst({
      where: { email: dto.email },
    });

    if (isExist) {
      throw new BadRequestException("the user already exists");
    }

    const password = await argon2.hash(dto.password);

    const user = await this.PrismaService.user.create({
      data: {
        email: dto.email,
        password,
      },
    });

    const tokens = await this.issueTokenPair(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.PrismaService.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException("user was not found");
    }

    const isValidPassword = await argon2.verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new BadRequestException("email or password is invalid");
    }

    const tokens = await this.issueTokenPair(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async delete(id: string) {
    const user = await this.PrismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("user was not found");
    }

    try {
      await this.PrismaService.user.delete({ where: { id } });

      return {
        message: "user was successfully deleted",
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId };

    const accessToken = await this.JwtService.signAsync(data, {
      expiresIn: "1h",
    });

    const refreshToken = await this.JwtService.signAsync(data, {
      expiresIn: "15d",
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.JwtService.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException("invalid refresh token");
    }

    const user = await this.PrismaService.user.findFirst({
      where: { id: result.id },
    });

    const tokens = await this.issueTokenPair(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async googleSignIn(user: any) {
    const dbUser = await this.PrismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return await this.googleRegister(user);
    }

    const tokens = await this.issueTokenPair(dbUser.id);

    return {
      dbUser,
      ...tokens,
    };
  }

  async googleRegister(user: any) {
    const dbUser = await this.PrismaService.user.create({
      data: {
        email: user.email,
      },
    });

    const tokens = await this.issueTokenPair(dbUser.id);

    return {
      dbUser,
      ...tokens,
    };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: "https://nest-new.onrender.com",
      expires: expiresIn,
      secure: true,
      sameSite: "none",
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      domain: "https://nest-new.onrender.com",
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
  }
}
