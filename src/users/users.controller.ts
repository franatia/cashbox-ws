import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentSub } from '@/common/decorators/token.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  create(@CurrentSub() user : string) {
    return this.usersService.getUser(user);
  }

}
