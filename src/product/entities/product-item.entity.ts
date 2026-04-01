import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";
import { ProductItemGroup } from "./product-item-group.entity";
import { Price } from "@/price/entities/price.entity";
import { Stock } from "@/stock/entities/stock.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "product-items"
})
export class ProductItem{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text",
        unique: true
    })
    sku!: string;

    @ManyToOne(
        () => Product,
        product => product.items,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToMany(
        () => FeatureValue,
        featureValue => featureValue.productItems,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    @JoinTable()
    featureValues!: FeatureValue[]

    @ManyToMany(
        () => ProductItemGroup,
        productItemGroup => productItemGroup.productItems,
        {
            eager: false
        }
    )
    itemGroups!: ProductItemGroup;

    @OneToMany(
        () => Price,
        price => price.productItem,
        {
            eager: false
        }
    )
    prices!: Price[];

    @OneToOne(
        () => Stock,
        stock => stock.productItem,
        {
            eager: false
        }
    )
    stock !: Stock;

    @Column({
        type: "boolean",
        default: true
    })
    webVisibility!: boolean;


}