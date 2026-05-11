import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { PriceList } from "@/price/entities/price-list.entity";
import { Item } from "@/product/entities/item.entity";
import { Tax } from "@/tax/entities/tax.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Lot } from "@/stock/entities/lot.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "order-details"
})
export class OrderItem {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Order,
        order => order.details,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    order!: Order;

    @ManyToOne(
        () => Item,
        {
            eager: false
        }
    )
    productItem!: Item;

    @ManyToOne(
        () => PriceList,
        {
            eager: false
        }
    )
    priceList!: PriceList;

    @Column({
        type: "int"
    })
    price!: number;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int",
        default: 0
    })
    totalTaxes!: number;
    
    @Column({
        type: "int"
    })
    profit!: number;

    @Column({
        type: "int"
    })
    discount!: number;

    @ManyToMany(
        () => Tax,
        {
            eager: false
        }
    )
    taxes!: Tax[];

    /**
     * 
     * RESERVE STAGE
     * 
     */

    @Column({
        type : "boolean",
        default: false
    })
    reserve !: boolean;

    @OneToOne(
        () => Lot,
        {
            nullable : true
        }
    )
    @JoinColumn()
    linkedLot ?: Lot

}