import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";
import { StockMovement } from "./stock-movement.entity";
import { Order } from "@/order/entities/order.entity";
import { OrderItem } from "@/order/entities/order-item.entity";
import { boolean } from "joi";


export enum LotType {
    PENDING = "PENDING",
    AVAILABLE = "AVAILABLE",
    BLOCK = "BLOCK"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "lots"
})
export class Lot{

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Stock,
        stock => stock.lots,
        {
            onDelete: "CASCADE",
            eager: false
        }
    )
    stock!: Stock;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int"
    })
    remaining!: number;

    @Column({
        type : "boolean",
        default : false
    })
    reserved !: boolean;

    @Column({
        type : "enum",
        enum : LotType
    })
    type !: LotType;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;

    @Column({
        type: "timestamptz",
        nullable : true
    })
    expiresAt!: Date | null;

    @OneToMany(
        () => StockMovement,
        stockMovement => stockMovement.createdLot,
        {
            nullable : false
        }
    )
    consumedStock !: StockMovement[];

    @OneToOne(
        () => OrderItem,
        orderItem => orderItem.linkedLot,
        {
            nullable : true
        }
    )
    linkedOrderItem ?: OrderItem;

}