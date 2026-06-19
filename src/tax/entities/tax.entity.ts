import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaxJurisdiction } from "../enums/jurisdiction.enum";
import { TaxValueType } from "../enums/value.enum";
import CountryTaxProfile from "./country-tax-profile.entity";
import { TaxProfile } from "./tax-profile.entity";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import type TaxMetadata from "./interfaces/tax-metadata.interface";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import SmallDecimalColumn from "@/common/decorators/orm/small-decimal.decorator";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";

export enum TaxDefinitionType {
    SYSTEM = "SYSTEM",
    USER = "USER"
}
export const TaxDefinitionTypeList = Object.values(TaxDefinitionType);

@Entity({
    schema : DatabaseSchemas.tax,
    name : "taxes"
})
export default class Tax {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: string;

    /**
     * 
     * Alias usado por el usuario,
     * supongamos que quiera usar dos IVA's
     * segun el producto, entonces necesita
     * diferenciar entre uno y otro
     * 
     */

    @Column({
        type: "text"
    })
    alias !: string;

    /**
     * 
     * Es el nombre real del impuesto
     * 
     */

    @Column({
        type: "text"
    })
    denomination !: string;

    /**
     * 
     * Es el id por el que es reconocido en el sistema
     * del ente recaudador
     * 
     */

    @Column({
        type: "text"
    })
    authorityReferenceCode !: string;

    @SmallDecimalColumn({
        default : 0
    })
    percentage !: number;

    @DecimalColumn({
        default : 0
    })
    amount !: number;

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
        type : "enum",
        enum : State,
        nullable : true
    })
    state ?: State | null;

    @Column({
        type : "enum",
        enum : Locality,
        nullable : true
    })
    locality ?: Locality | null;

    @Column({
        type: "enum",
        enum: TaxJurisdiction
    })
    jurisdiction !: TaxJurisdiction;

    @Column({
        type : "jsonb",
        nullable : true
    })
    metadata ?: TaxMetadata;

    @Column({
        type: "enum",
        enum: TaxDefinitionType
    })
    definitionType !: TaxDefinitionType;

    @ManyToOne(
        () => CountryTaxProfile,
        ctp => ctp.taxes,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    countryProfile ?: CountryTaxProfile;

    @ManyToOne(
        () => TaxProfile,
        tp => tp.ownTaxes,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    ownerProfile ?: TaxProfile;

    @ManyToMany(
        () => TaxProfile,
        tp => tp.collectiveTaxes,
    )
    @JoinTable({
        name : "taxes_tax_profiles",
        joinColumn : {
            name : "tax_id",
            referencedColumnName : "id"
        },
        inverseJoinColumn : {
            name : "tax_profile_id",
            referencedColumnName : "id"
        }
    })
    associatedProfiles !: TaxProfile[]

}
