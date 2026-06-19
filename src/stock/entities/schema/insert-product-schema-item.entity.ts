import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InsertProductSchema } from "./insert-product-schema.entity";
import { FeatureSchemaItem } from "@/feature-schema/entities/feature-schema-item.entity";

@Entity({
    schema : DatabaseSchemas.main,
    name : "insert-product-schema-items"
})
export class InsertProductSchemaItem {
    
    @PrimaryGeneratedColumn('uuid')
    id !: string;

    @ManyToOne(
        () => FeatureSchemaItem,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    featureSchemaItem !: FeatureSchemaItem;

    @ManyToOne(
        () => InsertProductSchema,
        insertProductSchema => insertProductSchema.items,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    schema !: InsertProductSchema;

    @Column({
        type : "int"
    })
    quantity !: number;

}