import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";
import { FeatureGroup } from "./feature-group.entity";

export enum ItemGroupType {
    FEATURES = "features",
    ITEMS = "items",
    FEATURE_GROUP = "feature-group"
}

@Entity({
    schema: DatabaseSchemas.product,
    name: "item_groups"
})
export class ItemGroup {
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
        type: "enum",
        enum: ItemGroupType
    })
    type !: ItemGroupType

    @Column({
        type: "bool",
        default: true
    })
    webVisibility!: boolean;

    @Column({
        type: "int",
        nullable: true
    })
    basePrice?: number;

    @ManyToOne(
        () => Product,
        product => product.itemGroups,
        {
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @ManyToOne(
        () => FeatureGroup,
        featureGroup => featureGroup.itemGroups,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    featureGroup?: FeatureGroup;

    @ManyToMany(
        () => Item,
        Item => Item.groups,
        {
            eager: false
        }
    )
    @JoinTable({
        name: "item_groups_product_items",
        joinColumn: {
            name: "item_group_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_item_id",
            referencedColumnName: "id"
        }
    })
    items!: Item[]

    @ManyToMany(
        () => FeatureValue,
        featureValue => featureValue.productItemGroups,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    @JoinTable({
        name: "item_groups_feature_values",
        joinColumn: {
            name: "item_group_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "feature_value_id",
            referencedColumnName: "id"
        }
    })
    featureValues!: FeatureValue[];

}