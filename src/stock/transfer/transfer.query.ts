import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { Transfer } from "../entities/transfer/transfer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrmParams, SaveParams } from "./types/params/query.params";
import { notObjectEmpty } from "@/common/helpers/object.helper";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TransferQuery extends BaseQuery<Transfer> {

    constructor(
        @InjectRepository(Transfer)
        repo : Repository<Transfer>
    ){
        super(Transfer, repo);
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async saveOne(
        params : SaveParams
    ){

        notObjectEmpty(params);
         
        const orm = this.makeOrm(params);

        const raw = await this.save(orm);

        if(!raw.length){
            throw new BadRequestException(
                "Transfer was not saved"
            );
        }

        return raw[0];

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    makeOrm(
        params: OrmParams
    ): DeepPartial<Transfer> {
        
        const {
            itemsId,
            projectId,
            sourceNodeId,
            targetNodeId,
            userCreatorId,
            ...rest
        } = params;

        const orm : DeepPartial<Transfer> = {
            ...rest
        };

        if(projectId){
            orm.project = {
                id : projectId
            }
        }

        if(itemsId){
            orm.items = itemsId.map(id => ({
                id
            }));
        }

        if(sourceNodeId){
            orm.sourceNode = {
                id : sourceNodeId
            };
        }

        if(targetNodeId){
            orm.targetNode = {
                id : targetNodeId
            };
        }

        if(userCreatorId){
            orm.createdBy = {
                id : userCreatorId
            };
        }

        return orm;

    }

    /**
     * 
     * @param id 
     * @returns 
     */

    async getNodesById(
        id : string
    ){

        const {
            sourceNode,
            targetNode
        } = await this.findOneOrFail({
            where : {
                id
            },
            relations : {
                sourceNode : true,
                targetNode : true
            }
        })

        return {
            sourceNodeId : sourceNode.id,
            targetNodeId : targetNode.id
        }

    }

}