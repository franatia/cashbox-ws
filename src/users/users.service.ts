import { Injectable } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Repository, ILike, Not } from 'typeorm';
import { User } from '@/auth/entities';

@Injectable()
export class UsersService {

  private readonly userRepo: Repository<User>;

  constructor(
    authService: AuthService
  ) {
    this.userRepo = authService.userRepo;
  }

  getUser(
    user: string
  ) {
    return this.userRepo.findOne({
      where: {
        id: user
      }
    })
  }

  async searchUsers(query: string, excludeUserId: string) {
    if (!query || query.trim().length < 3) {
      return [];
    }
    const searchPattern = `%${query.trim()}%`;
    return this.userRepo.find({
      where: [
        { email: ILike(searchPattern), id: Not(excludeUserId) },
        { username: ILike(searchPattern), id: Not(excludeUserId) },
      ],
      select: {
        id: true,
        email: true,
        username: true,
        imageProfile: true,
      },
      take: 10,
    });
  }

}

