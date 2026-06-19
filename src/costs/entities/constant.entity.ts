import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CostTag } from "../enums/tag.enum";
import { Project } from "@/project/entities/project.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";

@Entity({
    schema: DatabaseSchemas.cost,
    name: "constants"
})
export default class Constant {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @ManyToOne(
        () => Project,
        {
            nullable: false
        }
    )
    project !: Project;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    name !: string;

    @DecimalColumn()
    value !: number;

    @Column({
        type: "enum",
        array: true,
        enum: CostTag
    })
    tags !: CostTag[];

}