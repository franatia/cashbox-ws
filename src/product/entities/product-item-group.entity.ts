import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductItem } from "./product-item.entity";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "product-item-groups"
})
export class ProductItemGroup{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text",
        nullable: true
    })
    name!: string | null;

    @ManyToOne(
        () => Product,
        product => product.itemGroups,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToMany(
        () => ProductItem,
        productItem => productItem.itemGroups,
        {
            eager: false
        }
    )
    @JoinTable()
    productItems!: ProductItem[]

    @ManyToMany(
        () => FeatureValue,
        featureValue => featureValue.productItemGroups,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    @JoinTable()
    featureValues!: FeatureValue[];

    @Column({
        type: "bool",
        default: true
    })
    webVisibility!: boolean;

    @Column({
        type: "int",
        nullable: true
    })
    basePrice!: number | null;
}