import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import EmailDto from './dto/send-email.dto';
import RegisterDto from './dto/register.dto';
import { CurrentPayload, CurrentSub } from '../common/decorators/token.decorator';
import { JwtAccessGuard, JwtAuthEmailGuard, JwtAuthGuard, LogInGuard } from './guards/jwt.guard';
import LogInDto from './dto/log-in.dto';
import { User } from './entities';
import AuthEmailDto from './dto/auth-email.dto';
import type JwtAuthEmailPayload from './interfaces/jwt-auth-email-payload.interface';
import AuthDto from './dto/auth.dto';
import { VerifyEmailGuard } from './guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { Paths } from './enums/paths.enum';
import ProjectContextDto from './dto/project-context.dto';
import { SetAuthType } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RelationsConfig, RelationsRule } from '@/relations/decorators/relations.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /* =================== REGISTER ZONE =================== */


  @SetAuthType(AuthType.PUBLIC)
  @UseGuards(VerifyEmailGuard)
  @Post(Paths.SEND_EMAIL_TOKEN)
  sendEmailToken(@Body() emailDto: EmailDto) {
    return this.authService.sendEmailToken(emailDto.email);
  }

  @SetAuthType(AuthType.PUBLIC)
  @Post(Paths.EMAIL)
  validateEmail(@Body() authEmailDto: AuthEmailDto) {
    return this.authService.authEmail(authEmailDto);
  }

  @SetAuthType(AuthType.AUTH_EMAIL)
  @Post(Paths.REGISTER)
  register(
    @Body() registerDto: RegisterDto,
    @CurrentPayload() user: JwtAuthEmailPayload
  ) {

    return this.authService.registerUser(
      user.email,
      registerDto.password
    )

  }


  @SetAuthType(AuthType.ACCESS)
  @UseGuards(LogInGuard)
  @Post(Paths.LOG_IN)
  logIn(@Body() logInDto: LogInDto, @CurrentSub() user: string | null) {
    return this.authService.logIn(logInDto, user);
  }

  @SetAuthType(AuthType.AUTH)
  @UseGuards(JwtAuthGuard)
  @Post()
  auth(@Body() authDto: AuthDto, @CurrentSub() user: User) {
    return this.authService.auth(authDto, user);
  }
  
  @RelationsConfig(
    {
      from : "nodeId?",
      to : "projectId",
      rule : RelationsRule.NODE_TO_PROJECT
    }
  )
  @SetAuthType(AuthType.OFF_PROJECT_CONTEXT)
  @Post(Paths.PROJECT_CONTEXT)
  authProjectContext(
    @Body() dto: ProjectContextDto,
    @CurrentSub() user: string
  ) {
    return this.authService.authProjectContext(
      user,
      dto
    )
  }

}
