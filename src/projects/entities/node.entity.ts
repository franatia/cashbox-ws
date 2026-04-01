import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborator } from "./collaborator.entity";
import { Project } from "./project.entity";
import { Stock } from "@/stock/entities/stock.entity";
import { Cashbox } from "@/cashbox/entities/cashbox.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "nodes"
})
export class Node {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "text",
        nullable: false
    })
    name!: string;

    @ManyToOne(
        () => Project,
        project => project.nodes,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @OneToOne(
        () => Cashbox,
        cashbox => cashbox.node,
        {
            eager: false,
            nullable: false
        }
    )
    cashbox!: Cashbox;

    @ManyToMany(
        () => Collaborator,
        collaborator => collaborator.nodes,
        {
            eager: false,
            nullable: false
        }
    )
    collaborators!: Collaborator[];

    @OneToMany(
        () => Stock,
        stock => stock.node,
        {
            eager: false,
            nullable: false
        }
    )
    stock!: Stock[];

}