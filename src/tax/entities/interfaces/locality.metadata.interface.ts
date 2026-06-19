import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import StateMetadata from "./state.metadata.interface";

export default interface LocalityMetadata extends StateMetadata {
    localityName ?: string,
    localityCode ?: Locality
}