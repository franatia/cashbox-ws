import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { MovementsLinker } from "../entities/transfer/movements-linker.entity";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.params";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { MovementSearch } from "../movement/movement.search";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MovementsLinkerSearch extends BaseSearch {

    constructor(
        @InjectRepository(MovementsLinker)
        private readonly repo : Repository<MovementsLinker>,
    
        private readonly movementSearch : MovementSearch,
    ){
        super();
    }

    protected applyJoins(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<MovementsLinker>
    ): void {

        const {
            projectId,
            nodeId
        } = params; 
        
        if(projectId || nodeId){
            query.innerJoin(
                `${alias}.transferItem`,
                "transferItem"
            ).innerJoin(
                "transferItem.transfer",
                "transfer"
            )
        }

    }

    protected applyFilters(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<MovementsLinker>
    ): void {
        const {
            skip,
            take,
            ...parameters
        } = params; 

        const {
            id,
            sourceMovementId,
            targetMovementId,
            transferItemId,
            nodeId,
            projectId
        } = parameters;

        query.where("1=1");

        if(id){
            query.andWhere(
                `${alias}.id = :id`
            );
        }
        if(sourceMovementId){
            query.andWhere(
                `${alias}.sourceMovementId = :sourceMovementId`
            );
        }
        if(targetMovementId){
            query.andWhere(
                `${alias}.targetMovementId = :targetMovementId`
            );
        }
        if(transferItemId){
            query.andWhere(
                `${alias}.transferItemId = :transferItemId`
            );
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
        if(projectId){
            query.andWhere(
                "transfer.projectId = :projectId"
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
        params: SearchParams, 
        query: SelectQueryBuilder<MovementsLinker>
    ): void {
        query.select(
            makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "sourceMovement",
                    "targetMovement",
                    "transferItem",
                    "quantity"
                ]
            )
        )
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
        );
        this.applyJoins(
            alias,
            params,
            query
        )
        this.applyFilters(
            alias,
            params,
            query
        );

        return query.getMany();

    }

    get(params: SearchParams): Promise<any[]> {
        return this.search(
            "movementsLinker",
            params
        )
    }

    async getById(id: string): Promise<MovementsLinker> {
        
        const linker = await this.repo.findOneOrFail({
            where : {
                id
            },
            select : {
                id : true,
                createdAt : true,
                sourceMovement : true,
                targetMovement : true,
                transferItem : true,
                quantity : true
            }
        });

        const [
            sourceMovement,
            targetMovement
        ] = await Promise.all([
            this.getMovementById(linker.sourceMovement.id),
            this.getMovementById(linker.targetMovement.id)
        ])

        return {
            ...linker,
            sourceMovement,
            targetMovement
        };

    }

    private getMovementById(
        id : string
    ){
        return this.movementSearch.getById(
            id
        );
    }

}