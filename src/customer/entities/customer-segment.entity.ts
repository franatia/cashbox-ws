import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Project } from "@/project/entities/project.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";

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

    @ManyToMany(
        () => Customer,
        {
            eager: false
        }
    )
    @JoinTable()
    customers !: Customer[];

    @Column({
        type: "bool"
    })
    active !: boolean;

    @Column({
        type: "int"
    })
    priority !: number;

}