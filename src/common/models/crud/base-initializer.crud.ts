import { ObjectLiteral } from "typeorm";
import { BaseSaver } from "./query/base-saver.crud";
import {BaseQuery} from "./query/base-query.crud";
import { AuthContext } from "@/auth/auth.context";

export abstract class BaseInitializer <
    T extends ObjectLiteral,
    TParams extends object,
    TQuery extends BaseQuery<T>,
    TSaver extends BaseSaver<T, TParams, TQuery>
> {

    constructor(
        protected readonly saver : TSaver,
        protected readonly authContext : AuthContext
    ){}

    /**
     * 
     * SHORTCUTS
     * 
     */

    get userProjectId(){

        return this.authContext.userProject;

    }

    get userNodeId(){
        return this.authContext.userNode;
    }

    get optionalUserNodeId(){
        const context = this.authContext.userContext;
        return context.nodeId;
    }

    get userClientId(){
        return this.authContext.userClient;
    }

    /**
     * 
     * METHODS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    async initialize(
        params : TParams
    ){

        const entity = await this.saver.saveOne(params);
        
        await this.createLinkedEntities?.(entity);

        await this.onCreate?.(entity);

        return entity;

    }

    protected createLinkedEntities? (
        entity : T
    ) : Promise<void> | void;


    protected onCreate? (
        entity : T
    ) : Promise<void> | void;

}