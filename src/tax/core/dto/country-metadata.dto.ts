import { Country, CountryList } from "@/common/enum/jurisdiction/country.enum";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CountryMetadataDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    countryName ?: string;

    @IsOptional()
    @IsIn(CountryList)
    countryCode ?: Country;

}