import { Country } from "@/common/enum/jurisdiction/country.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Tax from "./tax.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.tax,
    name : "country_tax_profiles"
})
export default class CountryTaxProfile {
    
    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @Column({
        type : "text"
    })
    countryName !: string;

    @Column({
        type : "enum",
        enum : Country
    })
    countryCode !: Country;

    @Column({
        type : "text"
    })
    authorityName !: string;

    @OneToMany(
        () => Tax,
        tax => tax.countryProfile
    )
    taxes !: Tax[]

}