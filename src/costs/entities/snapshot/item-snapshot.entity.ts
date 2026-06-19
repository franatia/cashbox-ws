import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CostTag } from "../../enums/tag.enum";
import CostSnapshot from "./snapshot.entity";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import DecimalColumn from "@/common/decorators/orm/decimal-column.decorator";
import { ItemSnapshotType, ItemSnapshotTypeEnum } from "@/costs/enums/snapshot.enum";

@Entity({
    schema : DatabaseSchemas.cost,
    name : "item_snapshots"
})
export default class CostItemSnapshot {

    @PrimaryGeneratedColumn("uuid")
    id !: string;

    @CreateDateColumn({
        type : "timestamptz"
    })
    createdAt !: Date;

    @Column({
        type : "text"
    })
    name !: string;

    @DecimalColumn()
    value !: number;

    @Column({
        type : "enum",
        enum : ItemSnapshotTypeEnum
    })
    type !: ItemSnapshotTypeEnum;

    @Column({
        type : "enum",
        array : true,
        enum : CostTag
    })
    tags !: CostTag[];

    @ManyToOne(
        () => CostSnapshot,
        snapshot => snapshot.items,
        {
            nullable : false
        }
    )
    costSnapshot !: CostSnapshot;

}