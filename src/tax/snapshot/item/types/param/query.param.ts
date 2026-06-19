import { Country } from "@/common/enum/jurisdiction/country.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { TaxJurisdiction } from "@/tax/enums/jurisdiction.enum";
import { TaxValueType } from "@/tax/enums/value.enum";

export type OrmParams = {

    alias ?: string;
    denomination ?: string;
    valueType ?: TaxValueType;
    country ?: Country;
    state ?: State;
    locality ?: Locality;
    jurisdiction ?: TaxJurisdiction;
    percentage ?: number;
    taxBase ?: number;
    total ?: number;
    snapshotId ?: string;

}

export type SaveParams = {
    alias : string;
    denomination : string;
    valueType : TaxValueType;
    country : Country;
    state ?: State;
    locality ?: Locality;
    jurisdiction : TaxJurisdiction;
    percentage ?: number;
    taxBase ?: number;
    total : number;
    snapshotId : string;
}