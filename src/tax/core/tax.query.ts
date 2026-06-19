import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import Tax, { TaxDefinitionType } from "../entities/tax.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, In, Repository } from "typeorm";
import { TaxValueType } from "../enums/value.enum";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { TaxJurisdiction } from "../enums/jurisdiction.enum";
import TaxMetadata from "../entities/interfaces/tax-metadata.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { applyJurisdiction } from "../helpers/jurisdiction.helper";
import { notObjectEmpty } from "@/common/helpers/object.helper";

export type OrmParams = {
    id?: string;
    alias?: string;
    denomination?: string;
    authorityReferenceCode?: string;
    percentage?: number;
    amount?: number;
    valueType?: TaxValueType,
    country?: Country,
    state?: State | null,
    locality?: Locality | null,
    jurisdiction?: TaxJurisdiction,
    metadata?: TaxMetadata,
    definitionType?: TaxDefinitionType,
    countryProfileId?: string,
    ownerProfileId?: string
}

export type SaveParams = {
    alias : string;
    denomination : string;
    authorityReferenceCode : string;
    percentage ?: number;
    amount ?: number;
    valueType : TaxValueType,
    country?: Country,
    state?: State,
    locality?: Locality,
    jurisdiction ?: TaxJurisdiction,
    countryProfileId ?: string,
    ownerProfileId ?: string
    definitionType ?: TaxDefinitionType
    metadata ?: TaxMetadata,
}

export type SafeUpdateParams = {
    alias?: string;
    denomination?: string;
    authorityReferenceCode?: string;
    percentage?: number;
    amount?: number;
    valueType?: TaxValueType;
    country?: Country,
    state?: State,
    locality?: Locality,
    jurisdiction?: TaxJurisdiction;
    metadata?: TaxMetadata,
}

@Injectable()
export class TaxQuery extends BaseQuery<Tax> {

    constructor(
        @InjectRepository(Tax)
        repo: Repository<Tax>
    ) {
        super(Tax, repo);
    }

    /**
     * 
     * LINKERS
     * 
     */

    linkedToProject(
        id : string,
        projectId : string    
    ){
        const query = this.repo.createQueryBuilder("tax")
        
        query.leftJoin(
            "tax.associatedProfiles",
            "asTaxProfile"
        )
        .leftJoin(
            "tax.ownerProfile",
            "taxProfile"
        )

        query.where(
            "tax.id = :id",
            {
                id
            }
        )
        .andWhere(
            "taxProfile.projectId = :projectId",
            {
                projectId
            }
        ).orWhere(
            "asTaxProfile.projectId = :projectId",
            {
                projectId
            }
        )

        return query.getExists();
    }

    /**
     * 
     * FINDERS
     * 
     */

    private async findOneAndMerge(
        id: string,
        params: OrmParams
    ){
        const tax = await this.findOneOrFail({
            where: {
                id
            }
        });

        return this.repo.merge(
            tax,
            params
        );

    }

    /**
     * 
     * @param ids 
     * @returns 
     */

    findManyByIds(
        ids : string[]
    ){
        return this.findMany({
            where : {
                id : In(ids)
            }
        });
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * @param params 
     */

    async saveOne(
        params: SaveParams
    ) {

        const orm = this.makeOrm(params);

        const raw = await this.save(orm);

        return (raw.length) ? raw[0] : {};
    }

    /**
     * 
     * UPDATE
     * 
     */

    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */

    async updateOne(
        id: string,
        params: SafeUpdateParams
    ) {

        notObjectEmpty(params);

        await this.applyJurisdictionChanges(
            id,
            params
        );

        const raw = await this.resolveUpdate(
            {id},
            params
        );

        return raw;

    }

    /**
     * 
     * DELETE
     * 
     */

    async deleteOne(
        id : string 
    ){
        await this.delete({id});
        return {
            deletedTax : id
        };
    }
    
    removeAssociatedProfile(
        taxId : string,
        profileId : string
    ){
        return this.repo.createQueryBuilder()
            .relation(Tax, "associatedProfiles")
            .of(taxId)
            .remove(profileId);
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

    makeOrm(params: OrmParams) {

        const {
            countryProfileId,
            ownerProfileId,
            ...rest
        } = params;

        const orm: DeepPartial<Tax> = rest;

        const hasCountryProfile = !!countryProfileId;
        const hasOwnerProfile = !!ownerProfileId;

        if (hasOwnerProfile && hasCountryProfile) {
            throw new BadRequestException("Tax should be linked with country profile or owner profile, not both at same time");
        }

        if (hasCountryProfile) {
            orm.countryProfile = {
                id: countryProfileId
            }
        }

        if (hasOwnerProfile) {
            orm.ownerProfile = {
                id: ownerProfileId
            }
        }

        return orm;

    }

    private async applyJurisdictionChanges(
        id: string,
        params: OrmParams
    ) {

        const taxMerge = await this.findOneAndMerge(id, params);
        
        applyJurisdiction(taxMerge);
        
        params.jurisdiction = taxMerge.jurisdiction;
        params.country = taxMerge.country;
        params.state = taxMerge.state;
        params.locality = taxMerge.locality;

    }

}