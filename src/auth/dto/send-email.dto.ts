import { IsEmail, IsString } from "class-validator";

export default class SendEmailDto {

    @IsString()
    @IsEmail()
    email!: string
    
}