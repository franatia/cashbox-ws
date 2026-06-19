import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransferItem } from "./transfer-item.entity";
import { Movement } from "../movement.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity(
    {
        schema : DatabaseSchemas.stock,
        name : "movements-linkers"
    }
)
export class MovementsLinker {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Movement,
        {
            nullable : false
        }
    )
    sourceMovement !: Movement;

    @ManyToOne(
        () => Movement,
        {
            nullable : false
        }
    )
    targetMovement !: Movement;

    @ManyToOne(
        () => TransferItem,
        transferItem => transferItem.movementsLinkers,
        {
            nullable : false
        }
    )
    transferItem !: TransferItem;

    @Column({
        type: "int"
    })
    quantity!: number;

}