import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import { TaxProfile } from "../entities/tax-profile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TaxQuery } from "../core/tax.query";

type OrmParams = {
    id ?: string;
    projectId ?: string
}

type SaveParams = {
    projectId ?: string;
}

@Injectable()
export default class TaxProfileQuery extends BaseQuery<TaxProfile> {

    constructor(
        @InjectRepository(TaxProfile)
        repo : Repository<TaxProfile>,

        private readonly taxQuery : TaxQuery
    ){
        super(TaxProfile, repo);
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

    saveOne(
        params : SaveParams
    ){
        const orm = this.makeOrm(params);
        return this.save(orm);
    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param id 
     * @returns 
     */

    async deleteOne(
        id : string
    ){
        await this.removeFromCollectiveTaxes(id);
        await this.delete({
            id
        });
        return {
            deletedTaxProfile : id
        }
    }

    async removeFromCollectiveTaxes(
        id : string
    ){

        const taxes = await this.getCollectiveTaxesId(id);
        
        await Promise.all(
            taxes.map(tax => (
                this.taxQuery.removeAssociatedProfile(
                    tax,
                    id
                )
            ))
        )

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
        params : OrmParams
    ){

        const {
            projectId
        } = params;

        const orm : DeepPartial<TaxProfile> = {};

        if(projectId){
            orm.project = {
                id : projectId
            };
        }

        return orm;

    }

    async getCollectiveTaxesId(
        id : string
    ){
        
        const taxProfile = await this.findOneOrFail({
            where : {
                id
            },
            loadRelationIds : {
                relations : ["collectiveTaxes"]
            }
        });
        return taxProfile.collectiveTaxes.map(tax => String(tax));

    }

}