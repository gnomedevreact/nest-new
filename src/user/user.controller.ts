import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from './decorators/user.decorator';
import { UserService } from './user.service';

@Controller("users")
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Auth()
  @Get("get-all")
  async getAll() {
    return this.UserService.getAll();
  }

  @Auth()
  @Get("by-id")
  async byId(@CurrentUser("id") id: string) {
    return this.UserService.byId(id);
  }
}
