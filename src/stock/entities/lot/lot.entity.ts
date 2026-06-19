import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {Item} from "../item.entity";
import { Reserve } from "@/reserve/entities/reserve.entity";
import { LotStatus, LotType } from "../../enums/lot.enum";
import CostSnapshot from "@/costs/entities/snapshot/snapshot.entity";

@Entity({
    schema: DatabaseSchemas.stock,
    name: "lots"
})
export class Lot{

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Item,
        item => item.lots,
        {
            onDelete: "CASCADE",
            eager: false
        }
    )
    stockItem !: Item;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int"
    })
    remaining!: number;

    @Column({
        type : "enum",
        enum : LotStatus
    })
    status !: LotStatus;

    @Column({
        type : "enum",
        enum : LotType
    })
    type !: LotType

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;

    @Column({
        type: "timestamptz",
        nullable : true
    })
    expiresAt ?: Date;

    @OneToOne(
        () => Reserve,
        reserve => reserve.lot,
        {
            nullable : true
        }
    )
    @JoinColumn()
    reserve ?: Reserve;

    @ManyToOne(
        () => CostSnapshot,
        {
            nullable : true
        }
    )
    costSnapshot ?: CostSnapshot;

    //composityConsumition;

}