import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: DatabaseSchemas.main,
    name: "brands"
})
export class Brand {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text"
    })
    name!: string;

    @Column({
        type: "text"
    })
    description!: string;

    @Column({
        type: "text"
    })
    logoUrl!: string

    @Column({
        type: "text"
    })
    slug!: string;


}