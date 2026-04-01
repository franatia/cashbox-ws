import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Customer } from "@/customer/entities/customer.entity";
import { Order } from "@/order/entities/order.entity";
import { Payment } from "@/payment/entities/payment.entity";
import { PaymentListStatus } from "@/payment/entities/payment.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema : DatabaseSchemas.main,
    name : "debts"
})
export class Debt {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Customer,
        customer => customer.debts,
        {
            eager: false
        }
    )
    customer !: Customer;

    @ManyToOne(
        () => Project,
        project => project.debts,
        {
            eager: false
        }
    )
    project !: Project;

    @OneToMany(
        () => Order,
        order => order.debt,
        {
            eager: false
        }
    )
    orders !: Order[];

    @Column({
        type : "int"
    })
    subtotal !: number;

    @Column({
        type : "int"
    })
    interestRate !: number;
    
    @Column({
        type : "int"
    })
    interestAmount !: number; 

    @Column({
        type : "int"
    })
    total !: number; 

    @Column({
        type : "int"
    })
    remaining !: number; 

    @OneToMany(
        () => Payment,
        payment => payment.debt,
        {
            eager: false
        }
    )
    payments!: Payment[];

    @Column({
        type : "enum",
        enum : PaymentListStatus
    })
    paymentStatus !: PaymentListStatus;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type : "timestamptz"
    })
    concludeAt !: Date;

}
