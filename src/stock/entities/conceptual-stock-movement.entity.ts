import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";
import { User } from "@/auth/entities";
import { MovementDirection } from "@/common/constants/movement-direction.enum";
import { Lot } from "./lot.entity";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.main,
    name : "conceptual-stock-movements"
})
export class ConceptualStockMovement {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Stock,
        stock => stock.conceptualMovements,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    stock !: Stock;

    @ManyToOne(
        () => Lot,
        {
            eager: false,
            nullable: true
        }
    )
    lot !: Lot | null;

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
        enum: MovementDirection
    })
    direction !: MovementDirection;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;



}