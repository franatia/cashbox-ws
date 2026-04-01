import { User } from "@/auth/entities";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Node } from "@/projects/entities/node.entity";
import { Project } from "@/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockTransferItem } from "./stock-transfer-item.entity";

export enum StockTransferStatus {
    PENDING = "PENDING",
    DONE = "DONE"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "stock-transfers"
})
export class StockTransfer {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.stockTransfers,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project!: Project;

    @ManyToOne(
        () => Node,
        {
            eager: false,
            nullable: true
        }
    )
    sourceNode!: Node;

    @ManyToOne(
        () => Node,
        {
            eager: false,
            nullable: true
        }
    )
    targetNode!: Node;

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        {
            eager: false
        }
    )
    user!: User;

    @Column({
        type: "enum",
        enum: StockTransferStatus
    })
    status!: StockTransferStatus

    @OneToMany(
        () => StockTransferItem,
        stockTransfeItem => stockTransfeItem.transfer,
        {
            eager: false
        }
    )
    items!: StockTransferItem[]

}