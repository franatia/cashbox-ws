import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "@/auth/entities";
import { Node } from "./node.entity";

export enum CollaboratorRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "collaborators"
})
export class Collaborator {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(
        () => User
    )
    user!: User

    @ManyToOne(
        () => Project,
        project => project.collaborators,
        {
            onDelete: "CASCADE",
            nullable: false,
            eager: false
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
    node !: Node | undefined;

    @Column({
        type: "enum",
        enum: CollaboratorRole,
        default: CollaboratorRole.EMPLOYEE
    })
    role!: CollaboratorRole;
    
}