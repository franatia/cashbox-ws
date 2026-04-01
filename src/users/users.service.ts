import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '@/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities';

@Injectable()
export class UsersService {

  private readonly userRepo : Repository<User>;

  constructor(
    authService : AuthService
  ){
    this.userRepo = authService.userRepo;
  }

  getUser(
    user : string
  ){
    return this.userRepo.findOne({
      where : {
        id: user
      }
    })
  }

}
