import { InternalServerErrorException } from '@nestjs/common';
import {createTransport, Transporter} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default class MailManager {

    private transporter : Transporter
    
    constructor(
        senderEmail: string,
        senderEmailPass: string,
        service: string
    ){

        this.transporter = createTransport({
            service,
            auth: {
                user: senderEmail,
                pass: senderEmailPass
            }
        })

    }

    async sendEmailToken(userEmail: string, emailToken: string){
        const msg : Mail.Options = {
            from: '"Cashbox" <noreply@cashbox.com>',
            to: userEmail,
            subject: "Verificación de correo electrónico",
            html: `<h1>${emailToken}</h1>`
        }

        try{
            await this.transporter.sendMail(msg);
        }catch{
            throw new InternalServerErrorException("Error sending verification token");
        }
    }
}