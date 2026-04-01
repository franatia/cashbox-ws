import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, Feature, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";
import { FeatureSchema } from "./feature-schema.entity";

@Entity({
    name: "product-features"
})
export class ProductFeature {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text"
    })
    name!: string;

    @ManyToOne(
        () => Product,
        product => product.features,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @OneToMany(
        () => FeatureValue,
        featureValue => featureValue.productFeature,
        {
            eager: false
        }
    )
    values!: FeatureValue[];

    @ManyToOne(
        () => FeatureSchema,
        {
            eager: false,
            nullable: true
        }
    )
    schema !: FeatureSchema | null;

}