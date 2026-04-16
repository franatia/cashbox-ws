import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rule } from "./rule.entity";

export enum RuleEffectType {
    ENABLE_PRODUCT = "ENABLE_PRODUCT",
    DISABLE_PRODUCT = "DISABLE_PRODUCT",
    ACTIVE_PRICE = "ACTIVE_PRICE",
    PRODUCT_PERCENT_DISCOUNT = "PRODUCT_PERCENT_DISCOUNT",
    PRODUCT_CASH_DISCOUNT = "PRODUCT_CASH_DISCOUNT",
    PRODUCT_GROUP_PERCENT_DISCOUNT = "PRODUCT_GROUP_PERCENT_DISCOUNT",
    PRODUCT_GROUP_CASH_DISCOUNT = "PRODUCT_GROUP_CASH_DISCOUNT",
    PRODUCT_ITEM_GROUP_PERCENT_DISCOUNT = "PRODUCT_ITEM_GROUP_PERCENT_DISCOUNT",
    PRODUCT_ITEM_GROUP_CASH_DISCOUNT = "PRODUCT_ITEM_GROUP_CASH_DISCOUNT",
    PRICE_PERCENT_DISCOUNT = "PRICE_PERCENT_DISCOUNT",
    PRICE_CASH_DISCOUNT = "PRICE_CASH_DISCOUNT",
    CART_PERCENT_DISCOUNT = "CART_PERCENT_DISCOUNT",
    CART_CASH_DISCOUNT = "CART_CASH_DISCOUNT"
}

@Entity({
    schema: DatabaseSchemas.main,
    name : "rule-effects"
})
export class RuleEffect {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type : "enum",
        enum : RuleEffectType
    })
    type !: RuleEffectType;

    @ManyToOne(
        () => Rule,
        rule => rule.effects,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    rule !: Rule;

    @Column({
        type: "uuid"
    })
    entityId !: string;

    @Column({
        type: "text"
    })
    value !: string
}