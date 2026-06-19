import { TaxJurisdiction } from "@/tax/enums/jurisdiction.enum";
import { TaxValueType } from "@/tax/enums/value.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import SmallDecimalColumn from "@/common/decorators/orm/small-decimal.decorator";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { TaxSnapshot } from "./snapshot.entity";

@Entity({
    schema: DatabaseSchemas.tax,
    name: "tax_snapshots"
})
export class TaxItemSnapshot {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @Column({
        type: "text"
    })
    alias !: string;

    @Column({
        type: "text"
    })
    denomination !: string;

    @Column({
        type: "enum",
        enum: TaxValueType
    })
    valueType !: TaxValueType;

    @Column({
        type: "enum",
        enum: Country
    })
    country !: Country;

    @Column({
        type: "enum",
        enum: State,
        nullable: true
    })
    state?: State;

    @Column({
        type: "enum",
        enum: Locality,
        nullable: true
    })
    locality?: Locality;

    @Column({
        type: "enum",
        enum: TaxJurisdiction
    })
    jurisdiction !: TaxJurisdiction;

    @SmallDecimalColumn({
        nullable: true
    })
    percentage?: number;

    @DecimalColumn({
        nullable: true
    })
    taxBase?: number;

    @DecimalColumn()
    total !: number;

    @ManyToOne(
        () => TaxSnapshot,
        container => container.items,
        {
            nullable: false
        }
    )
    snapshot !: TaxSnapshot;

}