import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export default class UpdateFeatureValuesDto {

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", {each: true})
    featureValuesId !: string[];

}