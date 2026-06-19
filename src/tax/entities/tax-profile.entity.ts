import { User } from "@/auth/entities";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Tax from "./tax.entity";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { Project } from "@/project/entities/project.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.tax,
    name : "tax_profiles"
})
export class TaxProfile {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @OneToOne(
        () => Project,
        project => project.taxProfile,
        {
            onDelete : "CASCADE",
            nullable : false
        }
    )
    @JoinColumn()
    project !: Project;

    @OneToMany(
        () => Tax,
        tax => tax.ownerProfile,
    )
    ownTaxes !: Tax[];

    @ManyToMany(
        () => Tax,
        tax => tax.associatedProfiles
    )
    collectiveTaxes !: Tax[]

}