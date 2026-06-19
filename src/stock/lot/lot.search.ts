import { InjectRepository } from "@nestjs/typeorm";
import { Lot } from "../entities/lot/lot.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { SearchParams } from "./types/params/search.params";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class LotSearch extends BaseSearch{

    constructor(
        @InjectRepository(Lot)
        private readonly repo : Repository<Lot>
    ){
        super();
    }

     protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<Lot>
    ): void {
     
        const {
            nodeId,
            projectId,
            stockId
        } = params;

        query.leftJoin(
            `${alias}.reserve`,
            "reserve"
        )

        if(
            stockId ||
            nodeId ||
            projectId
        ){
            query.innerJoin(
                `${alias}.stockItem`,
                "stockItem"
            )
        }
        
        if(projectId){
            query.innerJoin(
                "stockItem.stock",
                "stock"
            )
        }

    }

    protected applyFilters(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<Lot>
    ): void {
        
        const {
            skip,
            take,
            ...parameters
        } = params; 

        const {
            costSnapshotId,
            id,
            nodeId,
            projectId,
            reserveId,
            status,
            stockId,
            stockItemId,
            type
        } = parameters;

        query.where("1=1");

        if(id){
            query.andWhere(
                `${alias}.id = :id`
            );
        }
        if(nodeId){
            query.andWhere(
                "stockItem.nodeId"
            )
        }
        if(costSnapshotId){
            query.andWhere(
                `${alias}.costSnapshotId`
            )
        }
        if(projectId){
            query.andWhere(
                "stock.projectId = :projectId"
            )
        }
        if(reserveId){
            query.andWhere(
                `${alias}.reserveId = :reserveId`
            );
        }
        if(stockId){
            query.andWhere(
                "stockItem.stockId = :stockId"
            );
        }
        if(stockItemId){
            query.andWhere(
                `${alias}.stockItemId = :stockItemId`
            )
        }
        if(status){
            query.andWhere(
                `${alias}.status = :status`
            )
        }
        if(type){
            query.andWhere(
                `${alias}.type = :type`
            );
        }

        query
            .setParameters(parameters)
            .distinct(true)
            .orderBy(`${alias}.createdAt`, "DESC")
            .skip(skip)
            .take(take)

    }

   

    protected applySelectors(
        alias: string,
        params: BasicSearchParams,
        query: SelectQueryBuilder<Lot>
    ): void {
        
        query.loadAllRelationIds({
            relations : [
                "costSnapshot"
            ]
        }).select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "expiresAt",
                    "quantity",
                    "remaining",
                    "status",
                    "type",
                    "costSnapshot"
                ]
            ),
            ...makeSelectors(
                "reserve",
                [
                    "id",
                    "createdAt"
                ]
            )
        ])

    }

    protected search(
        alias: string,
        params: SearchParams
    ) {

        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        );

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

    get(params: SearchParams) {
        return this.search(
            "lot",
            params
        )
    }

    getById(id: string) {
        return this.get({
            id,
            skip : 0,
            take : 1
        });
    }



}