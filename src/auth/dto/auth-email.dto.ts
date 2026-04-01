import { IsEmail, IsString, Length, MaxLength } from "class-validator";

export default class AuthEmailDto {

    @IsString()
    @IsEmail()
    email!: string

    @IsString()
    @Length(6)
    token!: string
}