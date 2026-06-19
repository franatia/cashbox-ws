import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/auth/entities";
import { Lot } from "./lot/lot.entity";
import {Item} from "./item.entity";
import { Order } from "@/order/entities/order.entity";
import { MovementReason } from "../enums/movement.enum";
import { OperationDirection } from "@/common/enum/operation.enum";
import { TransferItem } from "./transfer/transfer-item.entity";

@Entity({
    schema: DatabaseSchemas.stock,
    name: "movements"
})
export class Movement {

    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => User,
        {
            nullable: true
        }
    )
    createdBy ?: User;

    @ManyToOne(
        () => Item,
        item => item.movements,
        {
            onDelete: "CASCADE"
        }
    )
    stockItem!: Item;

    @ManyToOne(
        () => Lot,
        {
            nullable: true
        }
    )
    lot ?: Lot;

    @ManyToOne(
        () => TransferItem,
        {
            nullable: true
        }
    )
    transferItem ?: TransferItem;

    @ManyToOne(
        () => Order,
        order => order.movements,
        {
            nullable : true
        }
    )
    order ?: Order;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "enum",
        enum: OperationDirection
    })
    direction !: OperationDirection;

    @Column({
        type : "enum",
        enum : MovementReason
    })
    reason !: MovementReason;

}