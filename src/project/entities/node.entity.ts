import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborator } from "./collaborator.entity";
import { Project } from "./project.entity";
import { Cashbox } from "@/cashbox/entities/cashbox.entity";

@Entity({
    schema: DatabaseSchemas.project,
    name: "nodes"
})
export class Node {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    name!: string;

    @ManyToOne(
        () => Project,
        project => project.nodes,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @OneToOne(
        () => Cashbox,
        cashbox => cashbox.node,
        {
            nullable: false
        }
    )
    cashbox!: Cashbox;

    @OneToMany(
        () => Collaborator,
        collaborator => collaborator.node
    )
    collaborators!: Collaborator[];

}