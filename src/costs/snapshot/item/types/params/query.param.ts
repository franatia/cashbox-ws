import { ItemSnapshotType, ItemSnapshotTypeEnum } from "@/costs/enums/snapshot.enum";
import { CostTag } from "@/costs/enums/tag.enum";

export type OrmParams = {

    id ?: string;
    name ?: string;
    value ?: number;
    type ?: ItemSnapshotTypeEnum;
    tags ?: CostTag[];
    costSnapshotId ?: string; 

}

export type SaveParams = {
    name : string;
    value : number;
    type : ItemSnapshotType;
    tags : CostTag[];
    costSnapshotId : string;
}