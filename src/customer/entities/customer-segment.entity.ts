import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: DatabaseSchemas.main,
    name: "customer-segments"
})
export class CustomerSegment {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.customerSegments,
        {
            eager: false,
            onDelete : "CASCADE"
        }
    )
    project !: Project;

    @Column({
        type : "text"
    })
    name !: string;

    @Column({
        type: "text"
    })
    ruleTree !: string;

    @Column({
        type: "bool"
    })
    active !: boolean;

    @Column({
        type: "int"
    })
    priority !: number;

}