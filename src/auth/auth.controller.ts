import { Request, Response } from "express";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { Auth } from "./decorators/auth.decorator";
import { AuthDto } from "./dto/auth.dto";
import { GoogleOauthGuard } from "./guards/google-oauth.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("register")
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.AuthService.register(dto);
    this.AuthService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.AuthService.login(dto);
    this.AuthService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post("access-token")
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshTokenFromCookie =
      req.cookies[this.AuthService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookie) {
      this.AuthService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException("refresh token was not provided");
    }

    const { refreshToken, ...response } = await this.AuthService.getNewTokens(
      refreshTokenFromCookie
    );

    this.AuthService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Auth()
  @Delete("delete/:id")
  async delete(@Param("id") id: string) {
    return this.AuthService.delete(id);
  }

  @Auth()
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.AuthService.removeRefreshTokenFromResponse(res);
    return true;
  }

  //google

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, accessToken, dbUser, ...response } =
      await this.AuthService.googleSignIn(req.user);
    this.AuthService.addRefreshTokenToResponse(res, refreshToken);

    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 1);

    res.cookie("accessToken", accessToken, {
      sameSite: true,
      secure: false,
      expires: expiresIn,
    });

    res.cookie("user", JSON.stringify(dbUser), {
      sameSite: true,
      secure: false,
    });

    return res.redirect("http://localhost:3000");
  }
}
