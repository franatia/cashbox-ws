import { BaseQuery } from "@/common/models/crud/query/base-query.crud";
import { LotAccumulatedView } from "../entities/lot/lot-accumulated.view";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindByOptions } from "./types/params/query.params";
import { Injectable } from "@nestjs/common";
import { Brackets } from "typeorm";

@Injectable()
export class LotAccumulatedQuery extends BaseQuery<LotAccumulatedView> {

    constructor(
        @InjectRepository(LotAccumulatedView)
        repo: Repository<LotAccumulatedView>
    ) {
        super(LotAccumulatedView, repo);
    }

    /**
     * 
     * FINDERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    findLotsByOptions(
        options: FindByOptions
    ) {

        const {
            status,
            type,
            lotsId,
            quantityAccumulated,
            remainingAccumulated,
            stockItemId
        } = options;

        const alias = "lotAcc"

        const query = this.repo.createQueryBuilder(alias);

        query.where(
            `${alias}.stockItemId = :stockItemId`,
            {
                stockItemId
            }
        )

        if (status) {

            query.andWhere(
                `${alias}.status = :status`,
                {
                    status
                }
            )

        }

        if (type) {

            query.andWhere(
                `${alias}.type = :type`,
                {
                    type
                }
            )

        }

        if (lotsId?.length) {

            query.andWhere(
                `${alias}.id IN (:...lotsId)`,
                {
                    lotsId
                }
            )

        }


        if (quantityAccumulated) {

            const sq = this.filterByEnoughQuantitySq(
                quantityAccumulated,
                "quantityAccumulated"
            );

            query.andWhere(
                `${alias}.id IN (${sq.getQuery()})`,
                {
                    ...sq.getParameters()
                }
            )

        }

        if (remainingAccumulated) {

            const sq = this.filterByEnoughQuantitySq(
                remainingAccumulated,
                "remainingAccumulated"
            );

            query.andWhere(
                `${alias}.id IN (${sq.getQuery()})`,
                {
                    ...sq.getParameters()
                }
            )

        }

        return query
            .distinct(true)
            .orderBy(
                `${alias}.createdAt`,
                "ASC"
            )
            .getMany();

    }

    /**
     * 
     * @param params 
     * 
     */

    makeOrm(
        params: any
    ) {
        return {};
    }

    /**
     * 
     * FILTERS
     * 
     */

    /**
     * 
     * @param quantity 
     * @returns 
     */

    filterByEnoughQuantitySq(
        quantity: number,
        keySource: "quantityAccumulated" | "remainingAccumulated"
    ) {

        const alias = "filterEnoughQuantityLotAcc";

        const sq = this.repo.createQueryBuilder()
            .subQuery()
            .from(
                this.repo.target,
                alias
            );
        const intersectionSq = this.getIntersectionLotByQuantityRequiredSq(
            quantity,
            keySource
        )

        sq
            .select(
                `${alias}.id`
            ).where(
                `${alias}.${keySource} <= :quantity`,
                {
                    quantity
                }
            ).orWhere(
                `${alias}.id IN (${intersectionSq.getQuery()})`
            )
            .setParameters(
                intersectionSq.getParameters()
            ).orderBy(
                `${alias}.${keySource}`,
                "ASC"
            );

        return sq;

    }

    /**
     * 
     * @param quantity 
     * @param keySource 
     * @returns 
     */

    getIntersectionLotByQuantityRequiredSq(
        quantity: number,
        keySource: "quantityAccumulated" | "remainingAccumulated"
    ) {

        const alias = "intersectionLotAcc";
        const alias2 = "intersectionLotAcc2";

        return this.repo
            .createQueryBuilder()
            .subQuery()
            .from(
                this.repo.target,
                alias
            )
            .select(`${alias}.id`)
            .where(
                new Brackets(
                    qb => {
                        qb.where(
                            `${alias}.${keySource} > :quantity`
                        )
                        .andWhere(`
                            EXISTS (
                                SELECT 1
                                FROM ${this.repo.metadata.tablePath} "${alias2}"
                                WHERE "${alias2}"."${keySource}" <= :quantity
                            )
                        `)
                    }
                )
            )
            .orWhere(
                new Brackets(
                    qb => {
                        qb.where(
                            `${alias}.${keySource} > :quantity`
                        )
                        .andWhere(`
                            NOT EXISTS (
                                SELECT 1
                                FROM ${this.repo.metadata.tablePath} "${alias2}"
                                WHERE "${alias2}"."${keySource}" <= :quantity
                            )
                        `)
                    }
                )
            )
            .setParameters(
                {
                    quantity
                }
            )
            .orderBy(
                `${alias}.${keySource}`,
                "ASC"
            )
            .limit(1);

    }

}