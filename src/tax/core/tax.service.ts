import { Country } from "@/common/enum/jurisdiction/country.enum";
import {BaseService} from "../../common/models/crud/base-service.crud";
import { TaxValueType } from "../enums/value.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { TaxJurisdiction } from "../enums/jurisdiction.enum";
import { TaxDefinitionType } from "../entities/tax.entity";
import TaxMetadata from "../entities/interfaces/tax-metadata.interface";
import { SafeUpdateParams, SaveParams, TaxQuery } from "./tax.query";
import { BadRequestException, Injectable } from "@nestjs/common";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { applyJurisdiction } from "../helpers/jurisdiction.helper";
import TaxProfileQuery from "../tax-profile/tax-profile.query";

type CreateParams = {
    alias: string;
    denomination: string;
    authorityReferenceCode: string;
    percentage ?: number;
    amount ?: number;
    valueType: TaxValueType,
    country: Country,
    state ?: State,
    locality ?: Locality,
    jurisdiction ?: TaxJurisdiction,
    projectId : string,
    metadata ?: TaxMetadata,
}

type PutParams = SafeUpdateParams;

@Injectable()
export default class TaxService implements BaseService {

    constructor(
        private readonly query : TaxQuery,
        private readonly profileQuery : TaxProfileQuery
    ){}

    /**
     * 
     * LINKERS
     * 
     */

    /**
     * 
     * @param id 
     * @param projectId 
     */

    async linkedToProject(
        id : string,
        projectId : string,
        throwable : boolean = true
        
    ){
        const exists = await this.query.linkedToProject(
            id,
            projectId
        )

        if(!exists && throwable){
            throw new BadRequestException("Tax is not linked with project");
        }

        return exists;

    }

    async linkedToProjectProfile(
        id : string,
        projectId : string,
        throwable : boolean = true
    ){
        const exists = await this.query.exists({
            id,
            ownerProfile : {
                project : {
                    id : projectId
                }
            }
        })

        if(!exists && throwable){
            throw new BadRequestException("Tax is not linked with project profile");
        }

        return exists;

    }

    /**
     * 
     * HELPERS
     * 
     */

    private setDefinitionType(
        params: SaveParams
    ) {
        const hasCountryProfile = !!params.countryProfileId;
        const hasUserTaxProfile = !!params.ownerProfileId;

        if(hasCountryProfile && hasUserTaxProfile){
            throw new BadRequestException("Tax just can be SUS")
        }

        if (hasCountryProfile) {
            params.definitionType = TaxDefinitionType.SYSTEM;
        }

        if (hasUserTaxProfile) {
            params.definitionType = TaxDefinitionType.USER;
        }
    }

    private getProjectTaxProfile(
        projectId : string
    ){
        return this.profileQuery.findOneOrFail({
            where : {
                project : {
                    id : projectId
                }
            }
        })
    }

    private async prepareSaveParams(
        params : CreateParams
    ){

        /**
         * 
         * PREPARE DATA
         * 
         */

        const {
            projectId,
            ...rest
        } = params;

        const {id} = await this.getProjectTaxProfile(projectId);

        const saveParams : SaveParams = {
            ...rest,
            ownerProfileId: id
        }

        /**
         * 
         * APPLIERS
         * 
         */

        this.setDefinitionType(saveParams);
        applyJurisdiction(saveParams);

        return saveParams;

    }

    /**
     * 
     * CREATORS 
     * 
     */

    async create(
        params: CreateParams
    ) {

        const saveParams = await this.prepareSaveParams(params);        
        return this.query.saveOne(saveParams);
    
    }

    /**
     * 
     * PUT
     * 
     */

    put(
        id : string,
        params : PutParams
    ) {
        return this.query.updateOne(
            id,
            params
        )
    }

    /**
     * 
     * DELETE
     * 
     */

    delete(
        id : string
    ) {
        return this.query.deleteOne(id);
    }

}