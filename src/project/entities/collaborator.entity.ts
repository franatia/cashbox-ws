import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "@/auth/entities";
import { Node } from "./node.entity";
import { CollaboratorRole } from "../enums/roles.enum";

@Entity({
    schema: DatabaseSchemas.project,
    name: "collaborators"
})
export class Collaborator {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date

    @ManyToOne(
        () => User
    )
    user!: User

    @ManyToOne(
        () => Project,
        project => project.collaborators,
        {
            onDelete: "CASCADE",
            nullable: false
        }
    )
    project!: Project

    @ManyToOne(
        () => Node,
        node => node.collaborators,
        {
            eager: false,
            nullable: true
        }
    )
    node ?: Node;

    @Column({
        type: "enum",
        enum: CollaboratorRole,
        default: CollaboratorRole.EMPLOYEE
    })
    role!: CollaboratorRole;
    
}