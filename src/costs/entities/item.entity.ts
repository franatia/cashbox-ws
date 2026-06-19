import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Constant from "./constant.entity";
import Tax from "@/tax/entities/tax.entity";
import { CostTag } from "../enums/tag.enum";
import { Cost } from "./cost.entity";
import { ValueSource } from "../enums/source.enum";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import Rule from "./rule.entity";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";
import { ItemType } from "../enums/item.enum";

@Entity({
    schema: DatabaseSchemas.cost,
    name: "items"
})
export class Item {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @ManyToOne(
        () => Cost,
        cost => cost.items,
        {
            nullable: false
        }
    )
    cost !: Cost;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text",
        nullable: true
    })
    name ?: string;

    @Column({
        type: "enum",
        enum: ItemType
    })
    type !: ItemType;

    @Column({
        type: "enum",
        enum: ValueSource
    })
    valueSource !: ValueSource;

    @DecimalColumn({
        default : 0
    })
    defaultValue !: number;

    @Column({
        type: "enum",
        array: true,
        enum: CostTag
    })
    tags !: CostTag[];

    @ManyToOne(
        () => Constant,
        {
            onDelete: "CASCADE"
        }
    )
    constant !: Constant;

    @ManyToOne(
        () => Tax,
        {
            onDelete: "CASCADE"
        }
    )
    tax !: Tax;

    @ManyToMany(
        () => Rule,
        rule => rule.items
    )
    rules !: Rule[]

}