import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Feature } from "./feature.entity";
import { FeatureGroup } from "./feature-group.entity";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";

@Entity({
    name: "feature_group_items",
    schema: DatabaseSchemas.product
})
export default class FeatureGroupItem {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @Column({
        type: "bool",
        default: false
    })
    main !: boolean

    @Column({
        type: "int"
    })
    level !: number;

    @ManyToOne(
        () => Feature,
        {
            nullable: false,
        }
    )
    feature !: Feature;

    @ManyToOne(
        () => FeatureGroup,
        featureGroup => featureGroup.items,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    group !: FeatureGroup;

}