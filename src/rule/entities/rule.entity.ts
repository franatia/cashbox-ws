import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RuleCondition } from "./rule-condition.entity";
import { RuleEffect } from "./rule-effect.entity";
import { Project } from "@/projects/entities/project.entity";

export enum RuleOperator {
    AND = "AND",
    OR = "OR"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "rules"
})
export class Rule {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.rules,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project !: Project;

    @Column({
        type: "text"
    })
    name !: string;

    @Column({
        type: "bool",
        default: true
    })
    active !: boolean;

    @Column({
        type: "enum",
        enum: RuleOperator,
        nullable: true
    })
    operator !: RuleOperator | null;

    @OneToMany(
        () => RuleCondition,
        condition => condition.rule,
        {
            eager: false
        }
    )
    conditions !: RuleCondition[];

    @OneToMany(
        () => RuleEffect,
        effect => effect.rule,
        {
            eager: false
        }
    )
    effects !: RuleEffect[];

}
