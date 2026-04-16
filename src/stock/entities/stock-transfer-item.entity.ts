import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockTransfer } from "./stock-transfer.entity";
import { ProductItem } from "@/product/entities/product-item.entity";
import { StockMovement } from "./stock-movement.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "stock-transfer-items"
})
export class StockTransferItem {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => StockTransfer,
        stockTransfer => stockTransfer.items,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    transfer!: StockTransfer[];

    @OneToMany(
        () => StockMovement,
        stockMovement => stockMovement.transfer,
        {
            eager: false,
        }
    )
    stockMovements!: StockMovement[];

    @ManyToOne(
        () => ProductItem,
        {
            eager: false
        }
    )
    productItem!: ProductItem;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int"
    })
    unitCost!: number;

}