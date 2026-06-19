import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Item } from "./item.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.product,
    name : "composity"
})
export default class Composity {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type : "int",
        default : 0
    })
    quantity !: number

    @ManyToOne(
        () => Product,
        product => product.composities,
        {
            nullable : false
        }
    ) 
    product !: Product;

    @ManyToOne(
        () => Item,
        {
            nullable : false
        }
    )
    item !: Item;

}