import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({
    name: "sessions",
    schema: DatabaseSchemas.auth
})
export default class Session {

    @PrimaryGeneratedColumn()
    id!: string

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
    user!: User

    @Column({ type: "text" })
    tokenHash!: string

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: "timestamptz" })
    expiresAt!: Date

}