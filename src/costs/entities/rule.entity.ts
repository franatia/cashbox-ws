import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RuleOperator, RuleTag } from "../enums/rule.enum";
import { Item } from "./item.entity";
import { Cost } from "./cost.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";

/**
 * 
 * SI EL RULE:
 *  - Contiene items: Realiza la operacion sobre ellos
 *  - Contiene rules: Lee los rules
 *  - Contiene items y rules: Realiza la operacion sobre
 *    los items y sobre los resultados de los rules
 * 
 */

@Entity({
    schema: DatabaseSchemas.cost,
    name: "rules"
})
export default class Rule {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;
    /*
    @Column({
        type : "text"
    })
    name !: string;
    */
    @Column({
        type: "enum",
        enum: RuleOperator,
    })
    operator !: RuleOperator;

    @Column({
        type: "enum",
        enum: RuleTag,
        array: true
    })
    tags !: RuleTag[];

    @Column({
        type: "boolean",
        default: false
    })
    first !: boolean;

    @ManyToOne(
        () => Cost,
        cost => cost.rules,
        {
            nullable: false
        }
    )
    cost !: Cost;

    @ManyToMany(
        () => Item,
        item => item.rules
    )
    @JoinTable({
        name: "rules_cost_items",
        joinColumn: {
            name: "rule_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "item_id",
            referencedColumnName: "id"
        }
    })
    items !: Item[];

    @ManyToOne(
        () => Rule,
        rule => rule.children,
        {
            nullable : true
        }
    )
    parent ?: Rule;

    @OneToMany(
        () => Rule,
        rule => rule.parent
    )
    children !: Rule[];

}