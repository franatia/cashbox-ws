import { PriceList } from "@/price/entities/price-list.entity";
import { Product } from "@/product/entities/product.entity";
import { Project } from "@/project/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LinkingCatalog } from "./linking-catalog.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.catalog,
    name : "catalog"
})
export class Catalog {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type : "text",
        nullable : false
    })
    name !: string;

    @Column({
        type : "boolean",
        default : true
    })
    active !: boolean;

    @ManyToOne(
        () => Project,
        project => project.catalogs,
        {
            nullable : false
        }
    )
    project !: Project;

    @ManyToMany(
        () => Product,
        product => product.catalogs,
    )
    @JoinTable({
        name : "catalogs_products",
        joinColumn : {
            name : "catalog_id",
            referencedColumnName : "id"
        },
        inverseJoinColumn : {
            name : "product_id",
            referencedColumnName : "id"
        }
    })
    products !: Product[];

    @ManyToOne(
        () => PriceList,
        {
            nullable : false
        }
    )
    basePriceList !: PriceList;

    //TODO: RULE

    @OneToMany(
        () => LinkingCatalog,
        linkingCatalog => linkingCatalog.source,
    )
    links !: LinkingCatalog[];

}
