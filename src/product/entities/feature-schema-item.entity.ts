import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureSchema } from "./feature-schema.entity";

@Entity({
    schema : DatabaseSchemas.main,
    name : "feature-schema-items"
})
export class FeatureSchemaItem {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => FeatureSchema,
        featureSchema => featureSchema.items,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    schema !: FeatureSchema;

    @Column({
        type : "text"
    })
    value !: string;

}