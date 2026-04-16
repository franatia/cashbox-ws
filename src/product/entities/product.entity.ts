import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductGroup } from "./product-group.entity";
import { Project } from "@/projects/entities/project.entity";
import { ProductItem } from "./product-item.entity";
import { ProductFeature } from "./product-feature.entity";
import { ProductItemGroup } from "./product-item-group.entity";
import { Price } from "@/price/entities/price.entity";
import { ComposityItem } from "./composity-item.entity";
import { Brand } from "./brand.entity";

export enum ProductSubtractType {
    IMMEDIATE = "IMMEDIATE",
    CONCEPTUAL = "CONCEPTUAL",
    NONE = "NONE"
}

export enum ProductUnitType {
    G = "G",
    KG = "KG",
    L = "L",
    ML = "ML",
    UNIT = "UNIT"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "products"
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text",
        nullable: false
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string | null;

    @Column({
        type: "text"
    })
    slug!: string;

    @ManyToOne(
        () => Project,
        project => project.products,
        {
            eager: false,
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToMany(
        () => ProductGroup,
        productGroup => productGroup.products,
        {
            eager: false,
            nullable: false
        }
    )
    @JoinColumn()
    groups!: ProductGroup[]

    @OneToMany(
        () => ProductItem,
        productItem => productItem.product,
        {
            eager: false
        }
    )
    items!: ProductItem[]

    
    @OneToMany(
        () => ProductFeature,
        productFeature => productFeature.product,
        {
            eager: false
        }
    )
    features!: ProductFeature[];

    @OneToMany(
        () => ProductItemGroup,
        productItemGroup => productItemGroup.product,
        {
            eager: false
        }
    )
    itemGroups!: ProductItemGroup[];

    @OneToMany(
        () => Price,
        price => price.product,
        {
            eager: false
        }
    )
    prices!: Price[];

    @OneToMany(
        () => ComposityItem,
        composityItem => composityItem.product,
        {
            eager: false
        }
    )
    composityItems!: ComposityItem[];

    @ManyToOne(
        () => Brand,
        {
            eager: false
        }
    )
    brand!: Brand;

    @Column({
        type: "enum",
        enum: ProductSubtractType
    })
    subtractType!: ProductSubtractType;

    @Column({
        type: "bool",
        default: true
    })
    webVisibility!: boolean;

    @Column({
        type: "int",
        default: 0
    })
    basePrice!: number;

    @Column({
        type: "enum",
        enum: ProductUnitType
    })
    unit !: ProductUnitType;
}
