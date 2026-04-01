import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class LogInDto {
    
    @IsString()
    @IsEmail()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string

}