import { TaxValueType } from "@/tax/enums/value.enum";
import { TaxItem } from "../service.type";
import { TaxJurisdiction } from "@/tax/enums/jurisdiction.enum";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";

export type TaxItemPayload = TaxItem & {
    alias : string;
    denomination : string;
    valueType : TaxValueType;
    jurisdiction : TaxJurisdiction;
    country : Country;
    state ?: State;
    locality ?: Locality;
    percentage ?: number;
    taxBase ?: number;
    total : number;
}