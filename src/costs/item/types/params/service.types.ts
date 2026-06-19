import { ItemType } from "@/costs/enums/item.enum";
import { ValueSource } from "@/costs/enums/source.enum";
import { CostTag } from "@/costs/enums/tag.enum";

export type CreateParams = {
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

export type PutParams = {
    name ?: string;
    type ?: ItemType;
    valueSource ?: ValueSource;
    defaultValue ?: number;
    tags ?: CostTag[]
    constantId ?: string;
    taxId ?: string;
}

export type ItemTypeValidatorParams = {
    id ?: string;
    taxId ?: string;
    constantId ?: string;
    type ?: ItemType;
}