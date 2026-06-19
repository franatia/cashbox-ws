import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { Project } from "@/project/entities/project.entity";
import { Item } from "./item.entity";
import { Feature } from "./feature.entity";
import { ItemGroup } from "./item-group.entity";
import { Price } from "@/price/entities/price.entity";
import { Complement } from "./complement.entity";
import { Brand } from "./brand.entity";
import { FeatureGroup } from "./feature-group.entity";
import Composity from "./composity.entity";
import { Catalog } from "@/catalog/entities/catalog.entity";
import { LinkingCatalog } from "@/catalog/entities/linking-catalog.entity";

export enum ProductSubtractType {
    IMMEDIATE = "IMMEDIATE",
    CONCEPTUAL = "CONCEPTUAL",
    NONE = "NONE"
}

export enum ProductOriginType {
    DROPSHIPPING = "DROPSHIPPING",
    OWN = "OWN"
}

export enum ProductUnit {
    G = "G",
    KG = "KG",
    L = "L",
    ML = "ML",
    UNIT = "UNIT"
}

@Entity({
    schema: DatabaseSchemas.product,
    name: "products"
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    /**
     * 
     * IDENTIFIERS
     * 
     */

    @Column({
        type: "text",
        nullable: false,
        unique: true
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string;

    @Column({
        type: "text"
    })
    slug!: string;

    /**
     * 
     * CONFIG OPTIONS
     * 
     */

    /**
     * 
     * IMMEDIATE = La substraccion es inmediata, es decir que,
     * tras el pago de la orden el descuento de la o las unidades
     * en stock sera inmediato
     * 
     * CONCEPTUAL = La substraccion pasa por un estadio mas de analisis.
     * Esta pensado para productos cuya medicion es inexacta o volatil, por ejemplo: 
     * carne, harina, helado, etc. Primero se evalua desde una entidad ideal
     * que seria ConceptualStockMovement para luego efectuar la definitiva
     * tras la revision de la verdadera disponibilidad
     * 
     * NONE = No posee stock, pensado para servicios de generacion inmediata, o
     * mercancias elaboradas en el momento como por ejemplo comida en un restaurante
     * sin stock previo.
     * 
     */

    @Column({
        type: "enum",
        enum: ProductSubtractType
    })
    subtractType!: ProductSubtractType;

    /**
     * 
     * DROPSHIPPING = Generada a partir de la asociacion
     * a un catalogo de reventa para dropshipping
     * 
     * OWN = Propio del negocio
     * 
     */

    @Column({
        type : "enum",
        enum : ProductOriginType,
        default : ProductOriginType.OWN
    })
    originType !: ProductOriginType

    /**
     * 
     * Habilita la capacidad de reservar pedidos
     * especiales de la mercancia. Caracteristicas:
     *  - Permite generar ordenes sin existencia de stock
     *  - Crea lotes asignados a las ordenes de reserva (reserved = true)
     *    para diferenciarlos de los lotes destinados al publico
     *  - Pensado para manejo ordenado del stock de pedidos de
     *    fabricacion y de ordenes de venta inmediata.
     * 
     */

    @Column({
        type: "boolean",
        default: false
    })
    allowReservation !: boolean;

    //minimumReserveQuantity
    
    /**
     * 
     * Deshabilita la visibilidad en los
     * canales de venta
     * 
     */

    @Column({
        type: "bool",
        default: true
    })
    visibility!: boolean;

    /**
     * 
     * Deshabilit el producto
     * de todos los canales desde
     * donde se pueda realizar ventas
     * 
     */

    @Column({
        type : "boolean",
        default : true
    })
    active !: boolean;
    
    /**
     * 
     * Establece el basePrice por el cual
     * se basaran los priceLists (es el de menos
     * importancia para el calculo)
     * 
     */

    @Column({
        type: "int",
        default: 0
    })
    basePrice!: number;

    /**
     * 
     * Determina el tipo de unidad de medida
     * que maneja el producto
     * 
     */

    @Column({
        type: "enum",
        enum: ProductUnit
    })
    unit !: ProductUnit;

    @ManyToOne(
        () => Project,
        project => project.products,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    /**
     * 
     * MODULE RELATIONS
     * 
     */

    @ManyToMany(
        () => Group,
        productGroup => productGroup.products
    )
    groups!: Group[]

    @OneToMany(
        () => Item,
        Item => Item.product
    )
    items!: Item[]
    
    @OneToMany(
        () => ItemGroup,
        ItemGroup => ItemGroup.product
    )
    itemGroups!: ItemGroup[];


    @OneToMany(
        () => Feature,
        Feature => Feature.product
    )
    features!: Feature[];

    @OneToMany(
        () => FeatureGroup,
        featureGroup => featureGroup.product
    )
    featureGroups !: FeatureGroup[]

    @OneToMany(
        () => Complement,
        complement => complement.product,
        {
            eager: false
        }
    )
    complements!: Complement[];

    @OneToMany(
        () => Composity,
        composity => composity.product,
        {
            nullable: false
        }
    )
    composities !: Composity[]

    /**
     * 
     * FOREIGN RELATIONS
     * 
     */

    @OneToMany(
        () => Price,
        price => price.product,
        {
            eager: false
        }
    )
    prices!: Price[];

    @ManyToOne(
        () => Brand,
        {
            eager: false,
            nullable: true
        }
    )
    brand?: Brand;

    /**
     * 
     * CATALOGS RELATIONS
     * 
     */

    @ManyToMany(
        () => Catalog,
        catalog => catalog.products
    )
    catalogs !: Catalog[];

    @ManyToOne(
        () => LinkingCatalog,
        linkingCatalog => linkingCatalog.products,
        {
            nullable : true
        }
    )
    linkingCatalog ?: LinkingCatalog;

    @OneToOne(
        () => Product
    )
    @JoinColumn()
    linkingProduct !: Product;

}
