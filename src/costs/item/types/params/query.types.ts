import { ItemType } from "@/costs/enums/item.enum";
import { ValueSource } from "@/costs/enums/source.enum";
import { CostTag } from "@/costs/enums/tag.enum";

export type OrmParams = {

    id ?: string;
    costId ?: string;
    name ?: string;
    type ?: ItemType;
    valueSource ?: ValueSource;
    defaultValue ?: number;
    tags ?: CostTag[];
    constantId ?: string;
    taxId ?: string;

}

export type SaveParams = {
    costId : string;
    name ?: string;
    type : ItemType;
    valueSource : ValueSource;
    defaultValue ?: number;
    tags : CostTag[]
    constantId ?: string;
    taxId ?: string;
    rulesId ?: string[]
}

export type UpdateParams = {
    name ?: string;
    type ?: ItemType;
    valueSource ?: ValueSource;
    defaultValue ?: number;
    tags ?: CostTag[];
    constantId ?: string;
    taxId ?: string;
}