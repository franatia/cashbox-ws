import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeatureSchemaItem } from "./feature-schema-item.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "feature-schemas"
})
export class FeatureSchema {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @Column({
        type: "text"
    })
    name !: string;

    @OneToMany(
        () => FeatureSchemaItem,
        featureSchemaItem => featureSchemaItem.schema,
        {
            eager: false
        }
    )
    items !: string[];


    
}