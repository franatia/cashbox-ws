import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rule } from "./rule.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "rule-conditions"
})
export class RuleCondition {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Rule,
        rule => rule.conditions,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    rule !: Rule;

    @Column({
        type: "text"
    })
    ruleTree !: string;
    
}