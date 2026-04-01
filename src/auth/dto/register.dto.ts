import { IsString, Matches, MinLength } from "class-validator";

export default class RegisterDto {
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        {
            message:
                'Password must contain uppercase, lowercase, number and special character',
        },
    )
    @MinLength(8)
    password!: string
}
