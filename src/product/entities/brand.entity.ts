import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: DatabaseSchemas.product,
    name: "brands"
})
export class Brand {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    name!: string;

    @Column({
        type: "text",
        nullable : true
    })
    description ?: string;

    @Column({
        type: "text",
        nullable : true
    })
    logoUrl ?: string;

    @Column({
        type: "text"
    })
    slug!: string;


}