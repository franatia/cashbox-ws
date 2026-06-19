import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureValue } from "./feature-value.entity";
import { Product } from "./product.entity";

@Entity({
    schema: DatabaseSchemas.product,
    name: "features"
})
export class Feature {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    name!: string;

    @ManyToOne(
        () => Product,
        product => product.features,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    product!: Product;

    @OneToMany(
        () => FeatureValue,
        featureValue => featureValue.feature,
        {
            eager: false
        }
    )
    values!: FeatureValue[];

}