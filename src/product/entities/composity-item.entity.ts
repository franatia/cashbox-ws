import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ProductItem } from "./product-item.entity";
import { Price } from "@/price/entities/price.entity";
import { PriceList } from "@/price/entities/price-list.entity";

export enum ComposityItemType {
    SINGLE_OPTION = "SINGLE_OPTION",
    MULTIPLE_OPTIONS = "MULTIPLE_OPTIONS"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "composity-items",
})
export class ComposityItem {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Product,
        product => product.composityItems,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToMany(
        () => ProductItem,
        {
            eager: false
        }
    )
    productItems!: ProductItem[]

    @ManyToOne(
        () => PriceList,
        {
            eager: false,
            nullable: true
        }
    )
    priceList!: PriceList;

    @ManyToOne(
        () => Price,
        {
            eager: false,
            nullable: true
        }
    )
    price!: Price;

    @Column({
        type: "int",
        default: 1
    })
    defaultQuantity!: number;

    @Column({
        type: "bool",
        default: true
    })
    isOptional!: boolean;

    @Column({
        type: "bool",
        default: true
    })
    isQuantitySelectable!: boolean;

    @Column({
        type: "enum",
        enum: ComposityItemType
    })
    type!: ComposityItemType;

}