import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "product-groups"
})
export class ProductGroup{
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(
        () => Project,
        project => project.productGroups,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToOne(
        () => ProductGroup,
        productGroup => productGroup.groups,
        {
            eager: false,
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    parentGroup!: ProductGroup

    @Column({
        type: "bool",
        default: true
    })
    webVisibility!: boolean;

    @Column({
        type: "int",
        default: 0
    })
    level!: number;

    @Column({
        type: "text"
    })
    slug!: string;

    @Column({
        type: "text",
        nullable: true
    })
    path!: string;


    @ManyToMany(
        () => Product,
        product => product.groups,
        {
            eager: false
        }
    )
    products!: Product[]

    @OneToMany(
        () => ProductGroup,
        ProductGroup => ProductGroup.parentGroup,
        {
            eager: false,
            nullable: false
        }
    )
    groups!: ProductGroup[]
    
}