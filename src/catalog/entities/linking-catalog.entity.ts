import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Catalog } from "./catalog.entity";
import { Product } from "@/product/entities/product.entity";
import { Project } from "@/projects/entities/project.entity";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";

@Entity({
    schema : DatabaseSchemas.catalog,
    name : "linking_catalog"
})
export class LinkingCatalog {
    
    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Catalog,
        catalog => catalog.links,
        {
            nullable : false
        }
    )
    source !: Catalog;

    @OneToMany(
        () => Product,
        product => product.linkingCatalog
    )
    products !: Product[];

    @ManyToOne(
        () => Project,
        project => project.linkingCatalogs,
        {
            nullable : false
        }
    )
    project !: Project;

}