import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { PriceList } from "@/price/entities/price-list.entity";
import { ComplementItem } from "./complement-item.entity";

export enum ComplementType {
    SINGLE_OPTION = "SINGLE_OPTION",
    MULTIPLE_OPTIONS = "MULTIPLE_OPTIONS"
}

@Entity({
    schema: DatabaseSchemas.product,
    name: "complement",
})
export class Complement {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type : "text"
    })
    name !: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Product,
        product => product.complements,
        {
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @OneToMany(
        () => ComplementItem,
        complementItem => complementItem.complement
    )
    items!: ComplementItem[]

    @ManyToOne(
        () => PriceList,
        {
            nullable: true
        }
    )
    priceList?: PriceList;

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
        enum: ComplementType
    })
    type!: ComplementType;

}