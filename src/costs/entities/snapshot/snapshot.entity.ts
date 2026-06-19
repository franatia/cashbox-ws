import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import CostItemSnapshot from "./item-snapshot.entity";
import {TaxSnapshot} from "@/tax/entities/snapshot/snapshot.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";

@Entity({
    schema : DatabaseSchemas.cost,
    name : "snapshots"
})
export default class CostSnapshot {
    
    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @DecimalColumn()
    unitCost !: number;

    @OneToMany(
        () => CostItemSnapshot,
        itemSnapshot => itemSnapshot.costSnapshot
    )
    items !: CostItemSnapshot[];

    @OneToOne(
        () => TaxSnapshot,
        {
            nullable : true
        }
    )
    @JoinColumn()
    taxSnapshot ?: TaxSnapshot;

}