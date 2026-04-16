import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeatureSchemaItem } from "./feature-schema-item.entity";
import { Project } from "@/projects/entities/project.entity";

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

    @ManyToOne(
        () => Project,
        project => project.featureSchemas,
        {
            eager: false,
            onDelete: "CASCADE",
            nullable: false
        }
    )
    project !: Project;
    
}