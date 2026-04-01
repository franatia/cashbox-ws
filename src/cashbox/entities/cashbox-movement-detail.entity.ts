import { Payment } from "@/payment/entities/payment.entity";
import { StockMovement } from "@/stock/entities/stock-movement.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CashboxMovement } from "./cashbox-movement.entity";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";

@Entity({
    schema: DatabaseSchemas.main,
    name : "cashbox-movement-details"
})
export class CashboxMovementDetail {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "int",
        default: 0
    })
    total!: number;

    @OneToOne(
        () => Payment,
        {
            eager: false,
            nullable: true
        }
    )
    payment !: Payment;

    @OneToOne(
        () => StockMovement,
        {
            eager: false,
            nullable: true
        }
    )
    stockMovement!: StockMovement;

    @ManyToOne(
        () => CashboxMovement,
        cashboxMovement => cashboxMovement.details,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    movement !: CashboxMovement;

}