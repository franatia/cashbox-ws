import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cashbox } from "./cashbox.entity";
import { User } from "@/auth/entities";
import { CashboxMovementDetail } from "./cashbox-movement-detail.entity";
import { OperationDirection } from "@/common/enum/operation.enum";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

export enum CashboxMovementType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    PAYMENT = "PAYMENT",
    PROVIDER_PAYMENT = "PROVIDER_PAYMENT"
}

@Entity({
    schema : DatabaseSchemas.main,
    name : "cashbox-movements"
})
export class CashboxMovement {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string | null;


    @ManyToOne(
        () => Cashbox,
        cashbox => cashbox.movements,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    cashbox!: Cashbox;

    @Column({
        type: "enum",
        enum: CashboxMovementType
    })
    type!: CashboxMovementType;

    @Column({
        type: "enum",
        enum: OperationDirection
    })
    direction!: OperationDirection;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createAt!: Date;

    @ManyToOne(
        () => User,
        {
            eager: false,
            nullable: true
        }
    )
    user!: User | null;

    @OneToMany(
        () => CashboxMovementDetail,
        cashboxMovementDetail => cashboxMovementDetail.movement,
        {
            eager: false
        }
    )
    details!: CashboxMovementDetail[];


}