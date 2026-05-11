import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockTransfer } from "./stock-transfer.entity";
import { Item } from "@/product/entities/item.entity";
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
    transfer!: StockTransfer;

    // TODO: Crear relacion intermedia para agrupar los stockMovements
    // Que tengo sourceMovement targetMovement o asi, para darle un orden
    // Sino recibo tanto movimientos de egreso como ingreso y nose cual es cual

    @OneToMany(
        () => StockMovement,
        stockMovement => stockMovement.transfer,
        {
            eager: false,
        }
    )
    stockMovements!: StockMovement[];

    @ManyToOne(
        () => Item,
        {
            eager: false
        }
    )
    productItem!: Item;

    @Column({
        type: "int"
    })
    quantity!: number;

    @Column({
        type: "int"
    })
    unitCost!: number;

}