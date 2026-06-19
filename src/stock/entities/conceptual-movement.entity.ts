import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";
import { User } from "@/auth/entities";
import { Lot } from "./lot/lot.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import {Item} from "./item.entity";
import { OperationDirection } from "@/common/enum/operation.enum";

@Entity({
    schema : DatabaseSchemas.stock,
    name : "conceptual-stock-movements"
})
export class ConceptualMovement {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Item,
        item => item.conceptualMovements,
        {
            onDelete: "CASCADE"
        }
    )
    stock !: Stock;

    @ManyToOne(
        () => Lot,
        {
            nullable: true
        }
    )
    lot ?: Lot;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int"
    })
    unitCost!: number;

    @ManyToOne(
        () => User,
        {
            eager: false,
        }
    )
    createdBy!: User;

    @Column({
        type: "enum",
        enum: OperationDirection
    })
    direction !: OperationDirection;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;



}