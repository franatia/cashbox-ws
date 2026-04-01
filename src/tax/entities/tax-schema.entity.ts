import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema : DatabaseSchemas.main,
    name : "tax-schemas"
})
export class TaxSchema {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.taxSchemas,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @Column({
        type : "text"
    })
    name !: string;

    @Column({
        type: "int"
    })
    percent !: number;

}