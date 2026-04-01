import { IsUUID } from "class-validator";

export class FeatureValueDto {
    @IsUUID()
    id !: string;
}