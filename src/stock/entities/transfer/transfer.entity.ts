import { User } from "@/auth/entities";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Node } from "@/project/entities/node.entity";
import { Project } from "@/project/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransferItem } from "./transfer-item.entity";

@Entity({
    schema: DatabaseSchemas.stock,
    name: "transfers"
})
export class Transfer {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @ManyToOne(
        () => Project,
        project => project.stockTransfers,
        {
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToOne(
        () => Node,
        {
            nullable: false
        }
    )
    sourceNode!: Node;

    @ManyToOne(
        () => Node,
        {
            nullable: false
        }
    )
    targetNode!: Node;

    @ManyToOne(
        () => User,
    )
    createdBy!: User;

    @OneToMany(
        () => TransferItem,
        stockTransfeItem => stockTransfeItem.transfer
    )
    items!: TransferItem[]

    @Column({
        type : "text",
        nullable : true
    })
    description ?: string;

}