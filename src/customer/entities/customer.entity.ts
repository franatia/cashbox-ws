import { User } from "@/auth/entities";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Debt } from "@/debt/entities/debt.entity";
import { Order } from "@/order/entities/order.entity";
import { Payment } from "@/payment/entities/payment.entity";
import { Project } from "@/projects/entities/project.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: DatabaseSchemas.main,
    name: "customers"
})
export class Customer {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.customers,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToOne(
        () => User,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    user !: User;

    @OneToMany(
        () => Order,
        order => order.customer,
        {
            eager: false
        }
    )
    orders!: Order[];

    @OneToMany(
        () => Debt,
        debt => debt.customer,
        {
            eager: false
        }
    )
    debts !: Debt[];

}
