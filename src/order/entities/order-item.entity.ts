import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { PriceList } from "@/price/entities/price-list.entity";
import { Item } from "@/product/entities/item.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReserveOrderStatus } from "../enums/reserve.enum";
import { OrderStatus, OrderType } from "../enums/order.enum";
import { Reserve } from "@/reserve/entities/reserve.entity";
import { Order } from "./order.entity";

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
        type : "decimal",
        precision : 14,
        scale : 2
    })
    price!: number;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "decimal",
        precision: 14,
        scale: 2,
        default: 0
    })
    totalTaxes!: number;

    @Column({
        type: "decimal",
        precision: 14,
        scale: 2
    })
    profit!: number;

    @Column({
        type: "decimal",
        precision: 14,
        scale: 2
    })
    discount!: number;

    /*@Column({
        type: "decimal",
        precision: 14,
        scale: 2
    })*/

   //TAX SNAPSHOT

    /**
     * 
     * CONFIG SECTION
     * 
     */


    @Column({
        type: "enum",
        enum: OrderType
    })
    type !: OrderType;

    @Column({
        type: "enum",
        enum: OrderStatus,
        nullable: true
    })
    status?: OrderStatus;

    /**
     * 
     * RESERVE SECTION
     * 
     */

    @Column({
        type: "enum",
        enum: ReserveOrderStatus,
        nullable: true
    })
    reserveStatus?: ReserveOrderStatus;

    @OneToOne(
        () => Reserve,
        {
            nullable: true
        }
    )
    reserve?: Reserve

}