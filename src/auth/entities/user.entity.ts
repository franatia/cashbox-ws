import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Session from "./session.entity";
import { Project } from "@/project/entities/project.entity";

@Entity({
    name: "users",
    schema: DatabaseSchemas.auth
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

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
    username ?: string;

    @Column({
        type: "text",
        nullable: true
    })
    imageProfile ?: string;
    
    @OneToMany(
        () => Session, 
        (session) => session.user
    )
    sessions!: Session[]

    @OneToMany(
        () => Project,
        project => project.owner,
        {
            nullable: false
        }
    )
    projects!: Project[];
}
