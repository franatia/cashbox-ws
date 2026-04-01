import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "@/auth/entities";
import { Node } from "./node.entity";

export enum CollaboratorRole {
    ADMIN = "ADMIN",
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

    @ManyToMany(
        () => Node,
        node => node.collaborators,
        {
            eager: false,
            nullable: false
        }
    )
    @JoinColumn()
    nodes!: Node[]

    @Column({
        type: "enum",
        enum: CollaboratorRole,
        default: CollaboratorRole.EMPLOYEE
    })
    role!: CollaboratorRole

    @Column({
        type: "bool",
        default: false
    })
    allAccess!: boolean
    
}