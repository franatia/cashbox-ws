import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { FeatureSchemaItem } from "@/product/entities/feature-schema-item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InsertProductSchema } from "./insert-product-schema.entity";

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