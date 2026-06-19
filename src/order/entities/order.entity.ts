import { Channel } from "@/common/enum/channel.enum";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Customer } from "@/customer/entities/customer.entity";
import { Debt } from "@/debt/entities/debt.entity";
import { Payment } from "@/payment/entities/payment.entity";
import { PaymentListStatus } from "@/payment/entities/payment.enum";
import { Project } from "@/project/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Node } from "@/project/entities/node.entity";
import { Movement } from "@/stock/entities/movement.entity";
import { OrderStatus } from "../enums/order.enum";

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
        type: "bigint",
        default: 0
    })
    subtotal!: number;

    @Column({
        type: "bigint",
        default: 0
    })
    discount!: number;

    @Column({
        type: "bigint",
        default: 0
    })
    total!: number;

    @Column({
        type: "bigint",
        default: 0
    })
    profit!: number;

    @Column({
        type: "bigint",
        default: 0
    })
    totalTaxes!: number;
/*
    @ManyToMany(
        () => Tax,
        {
            eager: false
        }
    )
    taxes!: Tax[];*/

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
        () => OrderItem,
        orderItem => orderItem.order,
        {
            eager: false
        }
    )
    details!: OrderItem[];

    @OneToMany(
        () => Movement,
        movement => movement.order
    )
    movements !: Movement[]

}
