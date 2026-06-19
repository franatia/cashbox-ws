import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { InjectRepository } from "@nestjs/typeorm";
import { Transfer } from "../entities/transfer/transfer.entity";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchParams } from "./types/params/search.params";
import { makeSelectors } from "@/common/helpers/query/query.helper";
import { BadRequestException, Injectable } from "@nestjs/common";
import { TransferItemSearch } from "../transfer-item/transfer-item.search";

@Injectable()
export class TransferSearch extends BaseSearch {

    constructor(
        @InjectRepository(Transfer)
        private readonly repo: Repository<Transfer>,

        private readonly transferItemSearch : TransferItemSearch
    ) {
        super();
    }

    protected applyJoins(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<any>
    ): void {

        query.innerJoin(
            `${alias}.project`,
            "project"
        ).innerJoin(
            `${alias}.sourceNode`,
            "sorceNode"
        ).innerJoin(
            `${alias}.targetNode`,
            "targetNode"
        ).innerJoin(
            `${alias}.createdBy`,
            "userCreator"
        )

    }

    protected applyFilters(
        alias: string,
        params: SearchParams,
        query: SelectQueryBuilder<Transfer>
    ): void {
        const {
            skip,
            take,
            ...parameters
        } = params;

        const {
            id,
            projectId,
            sourceNodeId,
            targetNodeId,
            userCreatorId,
            nodeId
        } = parameters;

        query.where("1=1");

        if (id) {
            query.andWhere(
                `${alias}.id = :id`
            )
        }

        if (projectId) {
            query.andWhere(
                `${alias}.projectId = :projectId`
            )
        }

        if (sourceNodeId) {
            query.andWhere(
                `${alias}.sourceNodeId = :sourceNodeId`
            )
        }

        if (targetNodeId) {
            query.andWhere(
                `${alias}.targetNodeId = :targetNodeId`
            )
        }

        if(nodeId){
            query.andWhere(
                new Brackets(qb => {
                    qb.where(
                        `${alias}.sourceNodeId = :nodeId`
                    ).orWhere(
                        `${alias}.targetNodeId = :nodeId`
                    )
                })
            )
        }

        if(userCreatorId){
            query.andWhere(
                `${alias}.createdById = :userCreatorId`
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
        query: SelectQueryBuilder<Transfer>
    ): void {

        query.select([
            ...makeSelectors(
                alias,
                [
                    "id",
                    "createdAt",
                    "description"
                ]
            ),
            ...makeSelectors(
                "project",
                [
                    "id",
                    "name"
                ]
            ),
            ...makeSelectors(
                "sourceNode",
                [
                   "id",
                   "name"
                ]
            ),
            ...makeSelectors(
                "targetNode",
                [
                    "id",
                    "name"
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

    protected search(alias: string, params: SearchParams){
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
        )

        return query.getMany();

    }

    get(params: SearchParams) {
        return this.search(
            "transfer",
            params
        )
    }

    async getById(id: string): Promise<Transfer> {

        const items = await this.transferItemSearch.get({
            transferId : id,
            skip : 0,
            take : 6
        });

        const transfer = await this.getOneOrFail(id);

        return {
            ...transfer,
            items
        }

    }

    private async getOneOrFail(
        id : string
    ){

        const raw = await this.get({
            id,
            skip : 0,
            take : 1
        });

        if(!raw.length){
            throw new BadRequestException(
                "Transfer was not found"
            );
        }

        return raw[0];

    }

}