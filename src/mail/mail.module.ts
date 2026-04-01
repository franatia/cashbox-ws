import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MailManager from './managers/mail.manager';
import EmailConfig from '@/config/interfaces/email.config.interface';

@Module({
  providers: [
    {
      provide: MailManager,
      useFactory: (config: ConfigService) => {

        const emailConfig = config.get<EmailConfig>("email");

        if(!emailConfig) throw new InternalServerErrorException();

        return new MailManager(
            emailConfig.senderEmail,
            emailConfig.senderEmailPass,
            emailConfig.senderEmailService
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailManager],
})
export class MailModule {}