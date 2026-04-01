import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaxSchema } from "./tax-schema.entity";
import { Order } from "@/order/entities/order.entity";

@Entity({
    schema : DatabaseSchemas.main,
    name : "taxes"
})
export class Tax {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Order,
        order => order.taxes,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    order!: Order;

    @ManyToOne(
        () => TaxSchema,
        {
            eager: false,
            nullable: true
        }
    )
    schema!: TaxSchema | null;

    @Column({
        type: "int"
    })
    total !: number;

}
