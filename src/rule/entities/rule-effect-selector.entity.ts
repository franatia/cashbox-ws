import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RuleEffect } from "./rule-effect.entity";

export enum RuleEffectSelectorSource {
    PRODUCT_ITEM = "PRODUCT_ITEM",
    PRODUCT = "PRODUCT",
    PRODUCT_GROUP = "PRODUCT_GROUP",
    PRODUCT_ITEM_GROUP = "PRODUCT_ITEM_GROUP"
}

@Entity({
    schema : DatabaseSchemas.main,
    name : "rule-selectors"
})
export class RuleEffectSelector {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "enum",
        enum: RuleEffectSelectorSource
    })
    source!: RuleEffectSelector;

    @Column({
        type: "uuid",
    })
    sourceId!: string;

    @ManyToOne(
        () => RuleEffect,
        ruleEffect => ruleEffect.selectors,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    effect !: RuleEffect;

}