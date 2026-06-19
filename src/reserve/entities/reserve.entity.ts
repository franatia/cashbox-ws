import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Customer } from "@/customer/entities/customer.entity";
import { OrderItem } from "@/order/entities/order-item.entity";
import { Lot } from "@/stock/entities/lot/lot.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(
    {
        schema : DatabaseSchemas.main,
        name : "reserves"
    }
)
export class Reserve {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Customer,
        {
            nullable : false
        }
    )
    customer !: Customer;

    @OneToOne(
        () => OrderItem,
        orderItem => orderItem.reserve,
        {
            nullable : false
        }
    )
    @JoinColumn()
    orderItem !: OrderItem;

    @OneToOne(
        () => Lot,
        lot => lot.reserve,
        {
            nullable : false
        }
    )
    lot !: Lot;

}
