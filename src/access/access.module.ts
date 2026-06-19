import { forwardRef, Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { ProjectModule } from '@/project/project.module';
import { AccessGuard } from './guards/access.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Configuration from '@/config/interfaces/configuration.interface';

@Module({
  imports: [
    ProjectModule,
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<Configuration["auth"]>("auth")?.jwtSecret,
      })
    }),
  ],
  controllers: [AccessController],
  providers: [
    AccessService,
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    }
  ],
  exports: [AccessService]
})
export class AccessModule { }
