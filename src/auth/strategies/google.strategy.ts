import { Strategy, VerifyCallback } from "passport-google-oauth2";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get("CLIENT_ID"),
      clientSecret: configService.get("CLIENT_SECRET"),
      callbackURL: "http://localhost:7000/api/auth/google/callback",
      scope: ["profile", "email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: "google",
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
