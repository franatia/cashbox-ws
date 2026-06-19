import { Country } from "@/common/enum/jurisdiction/country.enum";

export default interface CountryMetadata {
    countryName ?: string;
    countryCode ?: Country
}