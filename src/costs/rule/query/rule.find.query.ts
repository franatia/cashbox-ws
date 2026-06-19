import { Injectable } from "@nestjs/common";
import RuleQuery from "./rule.query";
import { makeSelectors } from "@/common/helpers/query/query.helper";

@Injectable()
export class RuleFindQuery {

    constructor(
        private readonly query: RuleQuery
    ) { }

    findByCostIdAndMapRelations(
        costId: string
    ) {

        const query = this.query.repo.createQueryBuilder("rule");

        return query.where(
            "rule.costId = :costId",
            {
                costId
            }
        ).leftJoin(
            "rule.items",
            "item"
        )
            .loadAllRelationIds({
                relations: [
                    "parent",
                    "children"
                ]
            })
            .addSelect([
                ...makeSelectors(
                    "item",
                    ["id"]
                )
            ])
            .distinct(true)
            .orderBy(
                "rule.createdAt",
                "ASC"
            ).getMany();

    }

}