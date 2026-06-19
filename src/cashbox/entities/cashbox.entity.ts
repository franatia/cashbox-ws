import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Node } from "@/project/entities/node.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CashboxMovement } from "./cashbox-movement.entity";
import { Project } from "@/project/entities/project.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "cashboxes"
})
export class Cashbox {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(
        () => Project,
        project => project.cashboxes,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project !: Project;

    @OneToOne(
        () => Node,
        node => node.cashbox,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn()
    node!: Node;

    @OneToMany(
        () => CashboxMovement,
        cashboxMovement => cashboxMovement.cashbox,
        {
            eager: false
        }
    )
    movements !: CashboxMovement[];


}
