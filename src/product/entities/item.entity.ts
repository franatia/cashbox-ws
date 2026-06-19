import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";
import { ItemGroup } from "./item-group.entity";
import { Price } from "@/price/entities/price.entity";
import { Stock } from "@/stock/entities/stock.entity";
import { FeatureGroup } from "./feature-group.entity";
import { Cost } from "@/costs/entities/cost.entity";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";

@Entity({
    schema: DatabaseSchemas.product,
    name: "items"
})
export class Item {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text",
        nullable: true
    })
    name?: string;

    @Column({
        type: "text",
        unique: true
    })
    sku!: string;

    @Column({
        type: "boolean",
        default: true
    })
    webVisibility!: boolean;

    @DecimalColumn({
        default : 0
    })
    basePrice?: number;
    
    @DecimalColumn({
        default: 0
    })
    baseCost !: number;

    @ManyToOne(
        () => Product,
        product => product.items,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToMany(
        () => ItemGroup,
        itemGroup => itemGroup.items,
        {
            eager: false
        }
    )
    groups!: ItemGroup[];

    @ManyToMany(
        () => FeatureValue,
        {
            eager: false,
        }
    )
    @JoinTable({
        name: "items_feature_values",
        joinColumn: {
            name: "item_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "feature_value_id",
            referencedColumnName: "id"
        }
    })
    featureValues!: FeatureValue[]

    @ManyToOne(
        () => FeatureGroup,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    featureGroup?: FeatureGroup;

    @OneToMany(
        () => Price,
        price => price.productItem
    )
    prices!: Price[];

    @OneToOne(
        () => Stock,
        stock => stock.productItem,
        {
            eager: false,
            nullable: true
        }
    )
    stock?: Stock;

    @ManyToOne(
        () => Cost,
        cost => cost.productItems
    )
    cost !: Cost;
    
}