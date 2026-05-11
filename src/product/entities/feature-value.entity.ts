import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { ItemGroup } from "./item-group.entity";
import { Feature } from "./feature.entity";

@Entity({
    schema: DatabaseSchemas.product,
    name: "feature_values"
})
export class FeatureValue{

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    value!: string;

    @ManyToOne(
        () => Feature,
        feature => feature.values,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    feature!: Feature;

    @ManyToMany(
        () => Item,
        item => item.featureValues,
        {
            eager: false
        }
    )
    items!: Item[];

    @ManyToMany(
        () => ItemGroup,
        itemGroup => itemGroup.featureValues,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    productItemGroups!: ItemGroup[]

}