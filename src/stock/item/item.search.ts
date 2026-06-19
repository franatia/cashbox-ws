import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "../entities/item.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.params";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import LotSearch from "../lot/lot.search";
import { MovementSearch } from "../movement/movement.search";

export class ItemSearch extends BaseSearch {

    constructor(
        @InjectRepository(Item)
        private readonly repo : Repository<Item>,

        private readonly lotSearch : LotSearch,
        private readonly movementSearch : MovementSearch,
    ){
        super();
    }

    protected applyJoins(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<Item>
    ): void {

        const {
            projectId
        } = params; 

        query.innerJoin(
            `${alias}.node`,
            "node"
        )

        if(projectId){

            query.innerJoin(
                `${alias}.stock`,
                "stock"
            )

        }

    }

    protected applyFilters(
        alias: string, 
        params: SearchParams, 
        query: SelectQueryBuilder<Item>,
    ): void {
        
        const {
            skip,
            take,
            ...parameters
        } = params;

        const {
            id,
            nodeId,
            stockId,
            projectId
        } = parameters;

        query.where("1=1");

        if(id){
            query.andWhere(
                `${alias}.id = :id`
            )
        }
        if(nodeId){
            query.andWhere(
                `${alias}.nodeId = :nodeId`
            )
        }
        if(stockId){
            query.andWhere(
                `${alias}.stockId = :stockId`
            )
        }
        if(projectId){
            query.andWhere(
                "stock.projectId = :projectId"
            )
        }

        query.setParameters(parameters)
            .distinct(true)
            .orderBy(`${alias}.createdAt`, "DESC")
            .skip(skip)
            .take(take)

    }

    protected applySelectors(
        alias: string,
        params: Partial<SearchParams>,
        query: SelectQueryBuilder<Item>
    ): void {
        
        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "quantity",
                    "remaining"
                ]
            ),
            ...makeSelectors(
                "node",
                [
                    "id",
                    "name",
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
        );

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

    get(params: SearchParams){
        return this.search(
            "item",
            params
        )
    };

    async getById(id: string) : Promise<Item> {

        const lots = await this.lotSearch.get({
            stockItemId: id,
            skip : 0,
            take : 6
        });

        const movements = await this.movementSearch.get({
            stockItemId : id,
            skip : 0,
            take : 6
        })

        // TODO : ConceptualStockMovements
        
        const alias = "item";
        const query = this.repo.createQueryBuilder(alias)
            .leftJoin(
                `${alias}.node`,
                "node"
            )
            .where(
                `${alias}.id = :id`,
                {
                    id
                }
            );
        this.applySelectors(
            alias,
            {},
            query
        )
        
        const item = await query.getOneOrFail();

        return {
            ...item,
            lots,
            movements
        }

    }

}