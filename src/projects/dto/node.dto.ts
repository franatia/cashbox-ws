import { IsNotEmpty, IsString } from "class-validator";

export class NodeDto {
    @IsString()
    @IsNotEmpty()
    name !: string;
}