import LocalityMetadata from "./locality.metadata.interface";

export default interface TaxMetadata extends LocalityMetadata {
    legalBasis ?: string
}