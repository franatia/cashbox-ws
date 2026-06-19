import { InjectRepository } from "@nestjs/typeorm";
import { Movement } from "../entities/movement.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { SearchParams } from "./types/params/search.params";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { makeSelectors } from "@/common/helpers/query/query.helper";

export class MovementSearch extends BaseSearch {

    constructor(
        @InjectRepository(Movement)
        private readonly repo : Repository<Movement>
    ){
        super();
    }

    protected applyJoins(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<Movement>
    ): void {
        
        const {
            projectId,
            nodeId
        } = params;
        
        query.leftJoin(
            `${alias}.createdBy`,
            "userCreator"
        );

        if(projectId || nodeId){
            query.innerJoin(
                `${alias}.stockItem`,
                "stockItem"
            )
        }

        if(projectId){
            query.innerJoin(
                "stockItem.stock",
                "stock"
            );
        }

    }

    protected applyFilters(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<Movement>
    ): void {
        
        const {
            skip,
            take,
            ...parameters
        } = params; 

        const {
            direction,
            id,
            lotId,
            orderId,
            reason,
            stockItemId,
            transferItemId,
            userCreatorId,
            projectId,
            nodeId
        } = parameters;

        query.where(
            "1=1"
        );

        if(id){
            query.andWhere(
                `${alias}.id = :id`
            )
        }

        if(lotId){
            query.andWhere(
                `${alias}.lotId = :lotId`
            )
        }

        if(orderId){
            query.andWhere(
                `${alias}.orderId = :orderId`
            )
        }

        if(stockItemId){
            query.andWhere(
                `${alias}.stockItemId = :stockItemId`
            )
        }

        if(transferItemId){
            query.andWhere(
                `${alias}.transferItemId = :transferItemId`
            )
        }

        if(userCreatorId){
            query.andWhere(
                `${alias}.createdById = :userCreatorId`
            )
        }

        if(reason){
            query.andWhere(
                `${alias}.reason = :reason`
            )
        }

        if(direction){
            query.andWhere(
                `${alias}.direction = :direction`
            )
        }

        if(projectId){
            query.andWhere(
                "stock.projectId = :projectId"
            )
        }

        if(nodeId){
            query.andWhere(
                "stockItem.nodeId = :nodeId"
            )
        }

        query
            .setParameters(parameters)
            .distinct(true)
            .orderBy(`${alias}.createdAt`, "DESC")
            .skip(skip)
            .take(take);

    }

    protected applySelectors(
        alias: string, 
        params: BasicSearchParams, 
        query: SelectQueryBuilder<Movement>
    ): void {
        
        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "quantity",
                    "direction",
                    "reason"
                ]
            ),
            ...makeSelectors(
                "userCreator",
                [
                    "id",
                    "username",
                    "imageProfile"
                ]
            )
        ])

    }

    protected search(
        alias: string, 
        params: SearchParams
    ) {
     
        const query = this.repo.createQueryBuilder(
            alias
        )

        this.applySelectors(
            alias,
            params,
            query
        )
        this.applyJoins(
            alias,
            params,
            query
        )
        this.applyFilters(
            alias,
            params,
            query
        )

        return query.getMany()

    }

    get(
        params: SearchParams
    ) {
        
        return this.search(
            "movement",
            params
        );

    }

    async getById(id: string) {

        const alias = "movement";

        return this.repo.createQueryBuilder(
            alias
        ).leftJoin(
            `${alias}.createdBy`,
            "userCreator"
        ).where(`${alias}.id = :id`,{
            id
        }).select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "quantity",
                    "direction",
                    "reason",
                    "stockItem",
                    "lot",
                    "transferItem",
                    "order"
                ]
            ),
            ...makeSelectors(
                "userCreator",
                [
                    "id",
                    "username",
                    "imageProfile"
                ]
            )
        ]).getOneOrFail();

    }

}