import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transfer } from "./transfer.entity";
import { Item } from "@/product/entities/item.entity";
import { MovementsLinker } from "./movements-linker.entity";

@Entity({
    schema: DatabaseSchemas.stock,
    name: "transfer-items"
})
export class TransferItem {

    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Transfer,
        transfer => transfer.items,
        {
            onDelete: "CASCADE"
        }
    )
    transfer!: Transfer;

    @OneToMany(
        () => MovementsLinker,
        movLinkers => movLinkers.transferItem
    )
    movementsLinkers !: MovementsLinker[];

    @ManyToOne(
        () => Item,
        {
            eager: false,
            nullable : false
        }
    )
    productItem!: Item;

    @Column({
        type: "int"
    })
    quantity!: number;

}