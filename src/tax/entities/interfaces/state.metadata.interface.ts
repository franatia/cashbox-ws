import { State } from "joi";
import CountryMetadata from "./country.metadata.interface";

export default interface StateMetadata extends CountryMetadata {
    stateName ?: string;
    stateCode ?: State
}