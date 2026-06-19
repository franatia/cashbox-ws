import { Country } from "@/common/enum/jurisdiction/country.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { TaxJurisdiction } from "@/tax/enums/jurisdiction.enum";
import { TaxValueType } from "@/tax/enums/value.enum";
import { SaveParams } from "./query.param";

export type CreateParams = SaveParams & {

    items: ItemCreateParams[]

}

export type ItemCreateParams = {
    alias: string;
    denomination: string;
    valueType: TaxValueType;
    country: Country;
    state?: State;
    locality?: Locality;
    jurisdiction: TaxJurisdiction;
    percentage?: number;
    taxBase?: number;
    total: number;
}