import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { CostAccess } from "../enums/access.enum";
import {Item as ProductItem} from "@/product/entities/item.entity";
import Rule from "./rule.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Project } from "@/project/entities/project.entity";

@Entity({
    schema : DatabaseSchemas.cost,
    name : "costs"
})
export class Cost {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type : "text",
        nullable : true
    })
    name ?: string;

    @ManyToOne(
        () => Project,
        {
            nullable : false
        }
    )
    project !: Project;

    @OneToMany(
        () => Item,
        item => item.cost
    )
    items !: Item[];

    @OneToMany(
        () => Rule,
        rule => rule.cost,
    )
    rules !: Rule[];

    @Column({
        type : "enum",
        enum : CostAccess
    })
    access !: CostAccess;

    @OneToMany(
        () => ProductItem,
        productItem => productItem.cost
    )
    productItems !: ProductItem[];

}