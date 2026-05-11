import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateFeatureSchemaDto {

    @IsUUID()
    projectId !: string;

    @IsString()
    @IsNotEmpty()
    name !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each : true})
    values !: string[];

}