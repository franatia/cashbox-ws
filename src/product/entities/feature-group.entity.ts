import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ProductFeatureGroupItem from "./feature-group-item.entity";
import { ItemGroup } from "./item-group.entity";
import { Product } from "./product.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import FeatureGroupItem from "./feature-group-item.entity";

@Entity({
    name: "feature_groups",
    schema: DatabaseSchemas.product
})
export class FeatureGroup {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Product,
        product => product.featureGroups,
        {
            eager: false,
            nullable: false
        }
    )
    product !: Product;

    @OneToMany(
        () => ProductFeatureGroupItem,
        productFeatureGroupItem => productFeatureGroupItem.group,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    items !: FeatureGroupItem[];

    @OneToMany(
        () => ItemGroup,
        itemGroup => itemGroup.featureGroup,
        {
            eager: false
        }
    )
    itemGroups !: ItemGroup[];

}