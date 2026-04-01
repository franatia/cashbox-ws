import { Channel } from "@/common/constants/channel.enum";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Customer } from "@/customer/entities/customer.entity";
import { Debt } from "@/debt/entities/debt.entity";
import { Payment } from "@/payment/entities/payment.entity";
import { PaymentListStatus } from "@/payment/entities/payment.enum";
import { Project } from "@/projects/entities/project.entity";
import { Tax } from "@/tax/entities/tax.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./order-detail.entity";
import { Node } from "@/projects/entities/node.entity";

export enum OrderStatus {
    CART = "CART",
    OPEN = "OPEN",
    CONFIRMED = "CONFIRMED",
    FULLFILLED = "FULLFILLED",
    CANCELLED = "CANCELLED"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "orders"
})
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.orders,
        {
            eager: false
        }
    )
    project!: Project;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createAt!: Date;

    @Column({
        type: "timestamptz",
        nullable: true
    })
    concludeAt!: Date;

    @ManyToOne(
        () => Node,
        {
            eager: false,
            nullable: true
        }
    )
    sourceTarget!: Node | null;

    @ManyToOne(
        () => Node,
        {
            eager: false,
            nullable: true
        }
    )
    targetNode!: Node | null;

    @ManyToOne(
        () => Debt,
        debt => debt.orders,
        {
            eager: false,
            nullable: true
        }
    )
    debt!: Debt[];

    @ManyToOne(
        () => Customer,
        {
            eager: false
        }
    )
    customer!: Customer;

    @Column({
        type: "int",
        default: 0
    })
    subtotal!: number;

    @Column({
        type: "int",
        default: 0
    })
    discount!: number;

    @Column({
        type: "int",
        default: 0
    })
    total!: number;

    @Column({
        type: "int",
        default: 0
    })
    profit!: number;

    @Column({
        type: "int",
        default: 0
    })
    totalTaxes!: number;

    @ManyToMany(
        () => Tax,
        {
            eager: false
        }
    )
    taxes!: Tax[];

    @Column({
        type: "enum",
        enum: OrderStatus
    })
    status!: OrderStatus;

    @Column({
        type: "enum",
        enum: PaymentListStatus,
        default: PaymentListStatus.PENDING
    })
    paymentStatus!: PaymentListStatus;

    @Column({
        type: "enum",
        enum: Channel
    })
    channel!: Channel;

    @OneToMany(
        () => Payment,
        payment => payment.order,
        {
            eager: false
        }
    )
    payments!: Payment[];

    @OneToMany(
        () => OrderDetail,
        orderDetail => orderDetail.order,
        {
            eager: false
        }
    )
    details!: OrderDetail[]

}
