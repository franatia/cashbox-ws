import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { TransferItem } from "../entities/transfer/transfer-item.entity";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.params";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { MovementsLinkerSearch } from "../movements-linker/movements-linker.search";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TransferItemSearch extends BaseSearch {

    constructor(
        @InjectRepository(TransferItem)
        private readonly repo: Repository<TransferItem>,

        private readonly movementsLinkerSearch : MovementsLinkerSearch
    ) {
        super();
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<TransferItem>
    ): void {

        const {
            nodeId,
            projectId
        } = params; 

        query
            .innerJoin(
                `${alias}.productItem`,
                "productItem"
            )
            .innerJoin(
                "productItem.product",
                "product"
            )
            .leftJoin(
                "productItem.featureValues",
                "fv"
            )
            .leftJoin(
                "fv.feature",
                "feature"
            )

        if(nodeId || projectId){
            query.innerJoin(
                `${alias}.transfer`,
                "transfer"
            );
        }
    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<TransferItem>
    ): void {

        const {
            skip,
            take,
            ...parameters
        } = params

        const {
            id,
            productItemId,
            transferId,
            projectId,
            nodeId
        } = parameters;

        query.where(
            "1=1"
        );

        if (id) {
            query.andWhere(
                `${alias}.id = :id`
            )
        }
        if (productItemId) {
            query.andWhere(
                `${alias}.productItemId = :productItemId`
            )
        }
        if (transferId) {
            query.andWhere(
                `${alias}.transferId`
            )
        }
        if(projectId) {
            query.andWhere(
                "transfer.projectId = :projectId"
            )
        }
        if(nodeId){
            query.andWhere(
                new Brackets(qb => {
                    qb.where(
                        "transfer.sourceNodeId = :nodeId"
                    ).orWhere(
                        "transfer.targetNodeId = :nodeId"
                    )
                })
            )
        }

        query
            .setParameters(parameters)
            .distinct(true)
            .orderBy(
                `${alias}.createdAt`,
                "DESC"
            )
            .skip(skip)
            .take(take);

    }

    protected applySelectors(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<TransferItem>
    ): void {

        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "quantity",
                    "transfer"
                ]
            ),
            ...makeSelectors(
                "productItem",
                [
                    "id",
                    "name",
                    "sku"
                ]
            ),
            ...makeSelectors(
                "product",
                [
                    "id",
                    "name",
                    "description",
                    "slug",
                    "subtractType"
                ]
            ),
            ...makeSelectors(
                "fv",
                [
                    "id",
                    "value"
                ]
            ),
            ...makeSelectors(
                "feature",
                [
                    "id",
                    "name"
                ]
            )
        ])

    }

    protected search(
        alias: string, 
        params: SearchParams
    ): Promise<any[]> {
        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        )
        this.applyJoins(
            alias,
            params,
            query
        );
        this.applyFilters(
            alias,
            params,
            query
        );

        return query.getMany();
    }

    get(params: SearchParams): Promise<any[]> {

        return this.search(
            "transferItem",
            params
        )

    }

    async getById(id: string): Promise<TransferItem> {

        const movementsLinkers = await this.movementsLinkerSearch.get({
            transferItemId : id,
            skip : 0,
            take : 6
        });

        const transferItem = await this.getOneOrFail(id);

        return {
            ...transferItem,
            movementsLinkers
        }

    }

    private async getOneOrFail(
        id : string
    ){
        const raw = await this.get({
            id,
            skip : 0,
            take : 1
        })

        if(!raw.length){
            throw new BadRequestException(
                "Transfer item was not found"
            );
        }

        return raw[0];
    }

}