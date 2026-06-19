import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Product } from "@/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PriceList } from "./price-list.entity";
import { Item } from "@/product/entities/item.entity";

export enum PriceDiscountType {
    PERCENT = "PERCENT",
    AMOUNT = "AMOUNT"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "prices"
})
export class Price {

    @PrimaryGeneratedColumn("uuid")
    id !: string;
    
    @Column({
        type: "int"
    })
    price!: number;

    @Column({
        type: "enum",
        enum: PriceDiscountType,
        nullable: true
    })
    discountType!: PriceDiscountType | null;

    @Column({
        type: "int",
        nullable: true
    })
    discountValue!: number;

    @Column({
        type: "boolean",
        default: true
    })
    webVisibility!: boolean;

    @Column({
        type: "boolean",
        default: false
    })
    overWritten!: boolean;

    @Column({
        type: "int",
        nullable: true
    })
    minQuantity!: number;

    @ManyToOne(
        () => Product,
        product => product.prices,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToOne(
        () => Item,
        productItem => productItem.prices,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    productItem!: Item

    @ManyToOne(
        () => PriceList,
        {
            eager: false,
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    priceList!: PriceList;

}
