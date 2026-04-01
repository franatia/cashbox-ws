import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailToken } from './entities/email-token.entity';
import { MailModule } from '@/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Configuration from '@/config/interfaces/configuration.interface';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import { JwtAccessGuard, JwtAuthEmailGuard, JwtAuthGuard, JwtRefreshGuard } from './guards/jwt.guard';
import JwtAuthStrategy from './strategies/jwt-auth.strategy';
import JwtAuthEmailStrategy from './strategies/jwt-auth-email.strategy';
import Session from './entities/session.entity';
import { VerifyEmailGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailToken, Session]),
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<Configuration["auth"]>("auth")?.jwtSecret,
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    VerifyEmailGuard,

    JwtAuthEmailStrategy,
    JwtAuthEmailGuard,
    JwtAccessStrategy,
    JwtAccessGuard,
    JwtAuthStrategy,
    JwtAuthGuard,

    {
      provide: APP_GUARD,
      useClass: JwtRefreshGuard,
    },

  ],
  exports: [TypeOrmModule, JwtModule, AuthService]
})
export class AuthModule {}
