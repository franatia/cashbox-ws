import { FeatureValue } from "@/product/entities/feature-value.entity";
import CreateFeatureDto from "../dto/create-feature.dto";
import { Feature } from "@/product/entities/feature.entity";

export type FeatureWithContext = {
    productFeature: FeatureWithValues,
    dto: CreateFeatureDto
}

export type FeatureWithValues = Feature & { values: FeatureValue[] };