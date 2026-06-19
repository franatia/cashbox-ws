import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { SelectQueryBuilder } from "typeorm";

export abstract class BaseSearch {

    protected abstract search(alias : string, params : BasicSearchParams) : Promise<any[]>;

    protected abstract applyJoins(alias : string, params : BasicSearchParams, query : SelectQueryBuilder<any>) : void;

    protected abstract applyFilters(alias : string, params: BasicSearchParams, query : SelectQueryBuilder<any>) : void;

    protected abstract applySelectors(alias : string, params : BasicSearchParams, query : SelectQueryBuilder<any>) : void;

    abstract get(params : BasicSearchParams) : Promise<any[]>;

    abstract getById(id : string) : Promise<any>;

}