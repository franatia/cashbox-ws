import { IsUUID } from "class-validator";

export default class CreateContextDto {
    @IsUUID()
    groupId !: string
}