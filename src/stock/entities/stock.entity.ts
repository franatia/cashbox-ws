import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Item as ProductItem } from "@/product/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "@/project/entities/project.entity";
import {Item} from "./item.entity";


/**
 * 
 * En principio se generaria tantos Stock por product item, como Nodes haya
 * 
 * Razones:
 * * Cada sucursal o deposito tiene su stock y localizacion
 * * No podemos mezclar stock entre sucursales
 * * Cada Product Item representa una unidad de caracteristicas unicas y diferenciables.
 * 
 */

@Entity({
    schema: DatabaseSchemas.stock,
    name: "stock"
})
export class Stock {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        {
            onDelete: "CASCADE"
        }
    )
    project !: Project;

    @OneToOne(
        () => ProductItem,
        productItem => productItem.stock,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn()
    productItem!: ProductItem;

    @OneToMany(
        () => Item,
        item => item.stock
    )
    items !: Item[];

    @Column({
        type : "int",
        default : 0
    })
    quantity!: number;

    @Column({
        type : "int",
        default : 0
    })
    remaining!: number;

}
