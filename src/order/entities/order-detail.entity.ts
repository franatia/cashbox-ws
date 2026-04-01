import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { PriceList } from "@/price/entities/price-list.entity";
import { ProductItem } from "@/product/entities/product-item.entity";
import { Tax } from "@/tax/entities/tax.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "order-details"
})
export class OrderDetail {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Order,
        order => order.details,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    order!: Order;

    @ManyToOne(
        () => ProductItem,
        {
            eager: false
        }
    )
    productItem!: ProductItem;

    @ManyToOne(
        () => PriceList,
        {
            eager: false
        }
    )
    priceList!: PriceList;

    @Column({
        type: "int"
    })
    price!: number;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int",
        default: 0
    })
    totalTaxes!: number;
    
    @Column({
        type: "int"
    })
    profit!: number;

    @Column({
        type: "int"
    })
    discount!: number;

    @ManyToMany(
        () => Tax,
        {
            eager: false
        }
    )
    taxes!: Tax[];
}