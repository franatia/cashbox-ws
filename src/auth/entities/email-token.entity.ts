import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({
    name: "email-tokens",
    schema: DatabaseSchemas.auth
})
export class EmailToken {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    email!: string

    @Column({ type: "text" })
    tokenHash!: string

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @Column({ type: 'timestamptz' })
    expiresAt!: Date;

}