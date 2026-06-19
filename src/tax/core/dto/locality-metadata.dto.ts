import { Locality, LocalityList } from "@/common/enum/jurisdiction/locality.enum";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class LocalityMetadataDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    localityName ?: string;

    @IsOptional()
    @IsIn(LocalityList)
    localityCode ?: Locality;

}