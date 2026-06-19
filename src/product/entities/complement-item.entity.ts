import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Complement } from "./complement.entity";
import { Item } from "./item.entity";

@Entity({
    name : "complement_item",
    schema : DatabaseSchemas.product
})
export class ComplementItem {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Complement,
        complement => complement.items,
        {
            nullable : false,
            onDelete : "CASCADE"
        }
    )
    complement !: Complement;

    @ManyToOne(
        () => Item,
        {
            onDelete : "CASCADE"
        }
    )
    item !: Item

}