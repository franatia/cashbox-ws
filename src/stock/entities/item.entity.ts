import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lot } from "./lot/lot.entity";
import { Movement } from "./movement.entity";
import { ConceptualMovement } from "./conceptual-movement.entity";
import { Stock } from "./stock.entity";
import { Node } from "@/project/entities/node.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity(
    {
        schema : DatabaseSchemas.stock,
        name : "items"
    }
)
export class Item {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Stock,
        stock => stock.items,
        {
            nullable: false
        }
    )
    stock !: Stock;

    @ManyToOne(
        () => Node,
        {
            nullable: false,
            onDelete : "CASCADE"
        }
    )
    node !: Node;

    @OneToMany(
        () => Lot,
        lot => lot.stockItem,
        {
            eager: false
        }
    )
    lots!: Lot[];

    @OneToMany(
        () => Movement,
        movement => movement.stockItem,
        {
            eager: false
        }
    )
    movements!: Movement[];

    @OneToMany(
        () => ConceptualMovement,
        conceptualMovement => conceptualMovement.stock,
        {
            eager: false
        }
    )
    conceptualMovements!: ConceptualMovement[];

    @Column({
        type: "int",
        default: 0
    })
    quantity!: number;

    @Column({
        type: "int",
        default: 0
    })
    remaining !: number;

}