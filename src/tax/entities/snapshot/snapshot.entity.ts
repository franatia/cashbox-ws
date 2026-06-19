import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";
import { TaxItemSnapshot } from "./snapshot-item.entity";

@Entity({
    schema : DatabaseSchemas.tax,
    name : "tax_snapshots"
})
export class TaxSnapshot {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @DecimalColumn()
    total !: number;

    @OneToMany(
        () => TaxItemSnapshot,
        snapshot => snapshot.snapshot
    )
    items !: TaxItemSnapshot[];

}