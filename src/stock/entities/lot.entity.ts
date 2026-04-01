import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";
import { StockMovement } from "./stock-movement.entity";

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

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;

    @Column({
        type: "timestamptz",
        nullable : true
    })
    expiresAt!: Date | null;

}