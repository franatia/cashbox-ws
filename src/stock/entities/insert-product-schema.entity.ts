import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InsertProductSchemaItem } from "./insert-product-schema-item.entity";
import { FeatureSchema } from "@/product/entities/feature-schema.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "inert-product-schemas"
})
export class InsertProductSchema {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @ManyToOne(
        () => FeatureSchema,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    featureSchema !: FeatureSchema;

    @Column({
        type: "text"
    })
    name !: string;

    @OneToMany(
        () => InsertProductSchemaItem,
        insertProductSchemaItem => insertProductSchemaItem.schema,
        {
            eager: false
        }
    )
    items !: InsertProductSchemaItem[];

}