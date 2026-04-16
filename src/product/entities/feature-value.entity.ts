import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductItem } from "./product-item.entity";
import { ProductItemGroup } from "./product-item-group.entity";
import { ProductFeature } from "./product-feature.entity";
import { FeatureSchemaItem } from "./feature-schema-item.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "feature-values"
})
export class FeatureValue{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text"
    })
    value!: string;

    @ManyToOne(
        () => ProductFeature,
        productFeature => productFeature.values,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    productFeature!: ProductFeature;

    @ManyToOne(
        () => FeatureSchemaItem,
        {
            eager: false,
            nullable: true
        }
    )
    featureSchemaItem!: FeatureSchemaItem | null;

    @ManyToMany(
        () => ProductItem,
        productItem => productItem.featureValues,
        {
            eager: false
        }
    )
    productItems!: ProductItem[];

    @ManyToMany(
        () => ProductItemGroup,
        productItemGroup => productItemGroup.featureValues,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    productItemGroups!: ProductItemGroup[]

}