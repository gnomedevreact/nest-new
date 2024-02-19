import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { PrismaService } from "../../../db/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private ConfigService: ConfigService,
    private readonly PrismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get("JWT_SECRET"),
    });
  }

  async validate({ id }: { id: string }) {
    const user = await this.PrismaService.user.findFirst({ where: { id } });
    return user;
  }
}
