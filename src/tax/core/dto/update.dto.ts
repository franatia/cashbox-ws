import { Country, CountryList } from "@/common/enum/jurisdiction/country.enum";
import { Locality, LocalityList } from "@/common/enum/jurisdiction/locality.enum";
import { State, StateList } from "@/common/enum/jurisdiction/state.enum";
import { TaxJurisdiction } from "@/tax/enums/jurisdiction.enum";
import { TaxValueType, TaxValueTypeList } from "@/tax/enums/value.enum";
import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import TaxMetadataDto from "./tax-metadata.dto";

export default class UpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    alias ?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    denomination ?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    authorityReferenceCode ?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    percentage ?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    amount ?: number;

    @IsOptional()
    @IsIn(TaxValueTypeList)
    valueType ?: TaxValueType;

    @IsOptional()
    @IsIn(CountryList)
    country ?: Country;

    @IsOptional()
    @IsIn(StateList)
    state ?: State;

    @IsOptional()
    @IsIn(LocalityList)
    locality ?: Locality;

    @IsOptional()
    @IsIn([TaxJurisdiction.INTERNAL, TaxJurisdiction.OTHER])
    jurisdiction ?: TaxJurisdiction;

    @IsOptional()
    @ValidateNested()
    @Type(() => TaxMetadataDto)
    metadata ?: TaxMetadataDto;

}