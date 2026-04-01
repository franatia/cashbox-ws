import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: DatabaseSchemas.main,
    name: "bills"
})
export class Bill {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
}
