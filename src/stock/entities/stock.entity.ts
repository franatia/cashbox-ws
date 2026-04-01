import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { ProductItem } from "@/product/entities/product-item.entity";
import { Node } from "@/projects/entities/node.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { ConceptualStockMovement } from "./conceptual-stock-movement.entity";
import { Project } from "@/projects/entities/project.entity";
import { Lot } from "./lot.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "stock"
})
export class Stock {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.stock,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project !: Project;

    @ManyToOne(
        () => Node,
        node => node.stock,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    node!: Node;

    @OneToOne(
        () => ProductItem,
        productItem => productItem.stock,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    productItem!: ProductItem;

    @Column({
        type : "int",
        default: 0
    })
    quantity!: number;

    @Column({
        type : "int",
        default: 0
    })
    totalAmount!: number;

    @OneToMany(
        () => Lot,
        lot => lot.stock,
        {
            eager: false
        }
    )
    lots!: Lot[];

    @OneToMany(
        () => StockMovement,
        stockMovement => stockMovement.stock,
        {
            eager: false
        }
    )
    movements!: StockMovement[];

    @OneToMany(
        () => ConceptualStockMovement,
        conceptualStockMovement => conceptualStockMovement.stock,
        {
            eager: false
        }
    )
    conceptualMovements!: ConceptualStockMovement[];

}
