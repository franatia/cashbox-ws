import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Session from "./session.entity";
import { Project } from "@/projects/entities/project.entity";

@Entity({
    name: "users",
    schema: DatabaseSchemas.auth
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: "text",
        unique: true
    })
    email!: string;

    @Column({
        type: "text",
        select : false
    })
    password!: string;

    @Column({
        type: "text",
        nullable: true
    })
    username!: string | null;

    @Column({
        type: "text",
        nullable: true
    })
    imageProfile!: string | null;
    
    @OneToMany(
        () => Session, 
        (session) => session.user
    )
    sessions!: Session[]

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date

    @OneToMany(
        () => Project,
        project => project.owner,
        {
            nullable: false
        }
    )
    projects!: Project[];
}
