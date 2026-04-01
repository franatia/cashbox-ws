import { IsString, Length } from "class-validator";

export default class AuthDto {

    @IsString()
    @Length(6)
    token!: string
    
}