import { ItemSnapshotType } from "@/costs/enums/snapshot.enum";
import { CostTag } from "@/costs/enums/tag.enum";

export type ItemSnapshotPayload = {

    name : string;
    tags : CostTag[];
    value : number;
    type : ItemSnapshotType

}