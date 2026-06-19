import BaseGetDto from "@/common/models/dto/base-get.dto";
import { Country, CountryList } from "@/common/enum/jurisdiction/country.enum";
import { Locality, LocalityList } from "@/common/enum/jurisdiction/locality.enum";
import { State, StateList } from "@/common/enum/jurisdiction/state.enum";
import { TaxDefinitionType, TaxDefinitionTypeList } from "@/tax/entities/tax.entity";
import { TaxJurisdiction, TaxJurisdictionList } from "@/tax/enums/jurisdiction.enum";
import { TaxValueType, TaxValueTypeList } from "@/tax/enums/value.enum";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export default class GetDto extends BaseGetDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    authorityReferenceCode?: string;

    @IsOptional()
    @IsIn(CountryList)
    country?: Country;

    @IsOptional()
    @IsIn(StateList)
    state?: State;

    @IsOptional()
    @IsIn(LocalityList)
    locality?: Locality;

    @IsOptional()
    @IsIn(TaxJurisdictionList)
    jurisdiction?: TaxJurisdiction;

    @IsOptional()
    @IsIn(TaxValueTypeList)
    valueType?: TaxValueType;

    @IsOptional()
    @IsUUID()
    countryProfileId?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    hideProjectFilter?: boolean;

    @IsOptional()
    @IsIn(TaxDefinitionTypeList)
    definitionType?: TaxDefinitionType;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    searchText?: string;

}