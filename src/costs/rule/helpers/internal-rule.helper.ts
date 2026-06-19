import { BadRequestException } from "@nestjs/common";
import { InternalRuleParams } from "../types/rule.types";

export const getParentsId = (
    rule: InternalRuleParams,
    rules: Map<string, InternalRuleParams>
) => {
    const internalParentsId = rule.internalParentsId;

    if (!internalParentsId) return [];

    return internalParentsId.flatMap(internalId => {
        const param = rules.get(internalId);

        return param?.id ?? [];
    })
}

export const getEntitiesIdFromLinker = (
    internalIds : string[],
    linkerId: Map<string, string>,
) => {
    return internalIds!.map(internalId => {
        const entityId = linkerId.get(internalId);

        if (!entityId) {
            throw new BadRequestException("Internal rule was not found");
        }

        return entityId;
    });
}