import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Customer } from "@/customer/entities/customer.entity";
import { Debt } from "@/debt/entities/debt.entity";
import { Order } from "@/order/entities/order.entity";
import { Project } from "@/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod, PaymentStatus } from "./payment.enum";

@Entity({
    schema : DatabaseSchemas.main,
    name: "payments"
})
export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )

    @ManyToOne(
        () => Customer,
        {
            eager: false
        }
    )
    customer !: Customer;

    @Column({
        type: "int"
    })
    total !: number;

    @ManyToOne(
        () => Order,
        order => order.payments,
        {
            eager: false,
            nullable: true
        }
    )
    order !: Order | null;

    @ManyToOne(
        () => Debt,
        debt => debt.payments,
        {
            eager: false,
            nullable: true
        }
    )
    debt !: Debt;

    @Column({
        type : "enum",
        enum : PaymentMethod
    })
    method !: PaymentMethod;

    @Column({
        type: "enum",
        enum : PaymentStatus
    })
    status !: PaymentStatus;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

}
