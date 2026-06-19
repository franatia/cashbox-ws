import { IsOptional, IsString } from "class-validator";

export default class TaxMetadataDto {

    @IsOptional()
    @IsString()
    legalBasis ?: string;

}