import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { joinPaths } from '@/common/helpers/path.helper';
import EmailDto from './dto/send-email.dto';
import RegisterDto from './dto/register.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAccessGuard, JwtAuthEmailGuard, JwtAuthGuard, LogInGuard } from './guards/jwt.guard';
import LogInDto from './dto/log-in.dto';
import { User } from './entities';
import AuthEmailDto from './dto/auth-email.dto';
import type JwtAuthEmailPayload from './interfaces/jwt-auth-email-payload.interface';
import AuthDto from './dto/auth.dto';
import { VerifyEmailGuard } from './guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { Paths } from './constants/paths.enums';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* =================== REGISTER ZONE =================== */

  @UseGuards(VerifyEmailGuard)
  @Post(joinPaths(Paths.sendEmailToken))
  sendEmailToken(@Body() emailDto: EmailDto) {
    return this.authService.sendEmailToken(emailDto.email);
  }
  
  @Post(joinPaths(Paths.authEmail))
  validateEmail(@Body() authEmailDto: AuthEmailDto){
    return this.authService.authEmail(authEmailDto);
  }

  @UseGuards(JwtAuthEmailGuard)
  @Post(joinPaths(Paths.register))
  register(@Body() registerDto: RegisterDto, @CurrentUser() user: JwtAuthEmailPayload){

    return this.authService.registerUser(
      user.email,
      registerDto.password
    )

  }

  @UseGuards(JwtAccessGuard, LogInGuard)
  @Post(joinPaths(Paths.logIn))
  logIn(@Body() logInDto: LogInDto, @CurrentUser() user: User | null){
    return this.authService.logIn(logInDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  auth(@Body() authDto: AuthDto, @CurrentUser() user: User){
    return this.authService.auth(authDto, user);
  }

}
