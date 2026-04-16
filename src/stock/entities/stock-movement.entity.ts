import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";
import { User } from "@/auth/entities";
import { MovementDirection } from "@/common/constants/movement-direction.enum";
import { Lot } from "./lot.entity";
import { StockTransferItem } from "./stock-transfer-item.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "stock-movements"
})
export class StockMovement {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Stock,
        stock => stock.movements,
        {
            eager: false,
            onDelete: "CASCADE"
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
    unitCost!: number;

    @ManyToOne(
        () => User,
        {
            eager: false,
            nullable: true
        }
    )
    createdBy!: User;

    @ManyToOne(
        () => StockTransferItem,
        {
            eager: false,
            nullable: true
        }
    )
    transfer!: StockTransferItem | null;

    @ManyToOne(
        () => Lot,
        {
            eager: false,
            nullable: true
        }
    )
    lot !: Lot | null;

    @Column({
        type: "enum",
        enum: MovementDirection
    })
    direction !: MovementDirection;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

}