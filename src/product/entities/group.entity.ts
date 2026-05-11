import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
    schema: DatabaseSchemas.product,
    name: "groups"
})
export class Group {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type: "text"
    })
    name !: string;

    @ManyToOne(
        () => Project,
        project => project.groups,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToOne(
        () => Group,
        group => group.groups,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    parentGroup ?: Group;

    @ManyToMany(
        () => Product,
        product => product.groups,
        {
            eager: false
        }
    )
    @JoinTable({
        name: "groups_products",
        joinColumn: {
            name: "group_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products!: Product[];

    @OneToMany(
        () => Group,
        group => group.parentGroup
    )
    groups!: Group[];

    @Column({
        type: "bool",
        default: true
    })
    visibility!: boolean;

    @Column({
        type: "int",
        default: 0
    })
    level!: number;

    @Column({
        type: "text"
    })
    slug!: string;

    @Column({
        type: "text",
        nullable: true
    })
    path!: string;

}