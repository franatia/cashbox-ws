import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";

export class CreateFeatureSchemaItemsDto {

    @IsUUID()
    schemaId !: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each : true})
    values !: string[];

}