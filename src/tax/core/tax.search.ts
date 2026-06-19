import {BaseSearch} from "@/common/models/crud/base-search.crud";
import { BasicSearchParams } from "@/common/types/params/search-params.type";
import { Repository, SelectQueryBuilder } from "typeorm";
import Tax, { TaxDefinitionType } from "../entities/tax.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TaxValueType } from "../enums/value.enum";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { TaxJurisdiction } from "../enums/jurisdiction.enum";
import { State } from "@/common/enum/jurisdiction/state.enum";
import { Locality } from "@/common/enum/jurisdiction/locality.enum";
import { Injectable } from "@nestjs/common";

type SearchParams = {
    id?: string,

    authorityReferenceCode?: string,

    countryCode?: Country,
    stateCode?: State,
    localityCode?: Locality,
    jurisdiction?: TaxJurisdiction,

    valueType?: TaxValueType,

    countryProfileId?: string,

    ownerProfileId?: string,
    projectId?: string,
    hideProjectFilter?: boolean,

    definitionType?: TaxDefinitionType,

    searchText?: string
} & BasicSearchParams

@Injectable()
export default class TaxSearch extends BaseSearch {

    constructor(
        @InjectRepository(Tax)
        readonly repo: Repository<Tax>
    ) {
        super()
    }

    applyJoins(alias: string, params: SearchParams, query: SelectQueryBuilder<Tax>): void {

        const {
            projectId
        } = params;

        if (projectId) {

            query.innerJoin(
                `${alias}.ownerProfile`,
                "taxProfile"
            )
        }

    }

    applyFilters(alias: string, params: SearchParams, query: SelectQueryBuilder<Tax>): void {

        const {
            id,
            authorityReferenceCode,
            countryCode,
            countryProfileId,
            definitionType,
            jurisdiction,
            localityCode,
            ownerProfileId,
            projectId,
            searchText,
            stateCode,
            skip,
            take,
            valueType
        } = params;

        query.where("1=1");

        if (id) {
            query.andWhere(`${alias}.id = :id`, { id });
        }

        if (authorityReferenceCode) {
            query.andWhere(`${alias}.authorityReferenceCode = :authorityReferenceCode`, {
                authorityReferenceCode
            })
        }

        if (countryCode) {
            query.andWhere(`${alias}.countryCode = :countrCode`, {
                countryCode
            })
        }

        if (countryProfileId) {
            query.andWhere(`${alias}.countryProfileId = :countryProfileId`, {
                countryProfileId
            })
        }

        if (definitionType) {
            query.andWhere(`${alias}.definitionType = :definitionType`, {
                definitionType
            })
        }

        if (jurisdiction) {
            query.andWhere(`${alias}.jurisdiction = :jurisdiction`, {
                jurisdiction
            })
        }

        if (localityCode) {
            query.andWhere(`${alias}.localityCode = :localityCode`, {
                localityCode
            })
        }

        if (stateCode) {
            query.andWhere(`${alias}.stateCode = :stateCode`, {
                stateCode
            })
        }

        if (ownerProfileId) {
            query.andWhere(`${alias}.ownerProfileId = :ownerProfileId`, {
                ownerProfileId
            })
        }

        if (projectId) {
            query.andWhere("taxProfile.projectId = :projectId", {
                projectId
            })
        }

        if (valueType) {
            query.andWhere(`${alias}.valueType = :valueType`, {
                valueType
            })
        }

        if (searchText) {
            this.applySearchFilter(
                alias,
                searchText,
                query
            )
        } else {
            query.orderBy(`${alias}.createdAt`, "DESC")
        }

        query.distinct(true)
            .skip(skip)
            .take(take)

    }

    applySearchFilter(
        alias: string,
        searchText: string,
        query: SelectQueryBuilder<Tax>
    ) {
        const normalizedSearch = searchText.trim();

        if (!normalizedSearch) return;

        query.andWhere(
            `(unaccent(${alias}.alias) ILIKE unaccent(:searchText)
            OR unaccent(${alias}.denomination) ILIKE unaccent(:searchText))`,
            {
                searchText: `%${normalizedSearch}%`
            }
        );

        query.addSelect(`
            CASE
                WHEN unaccent(${alias}.alias) ILIKE unaccent(:exactSearch) THEN 1
                WHEN unaccent(${alias}.denomination) ILIKE unaccent(:exactSearch) THEN 2
                WHEN unaccent(${alias}.alias) ILIKE unaccent(:startsSearch) THEN 3
                WHEN unaccent(${alias}.denomination) ILIKE unaccent(:startsSearch) THEN 4
                ELSE 5
            END
        `, "search_rank");

        query.orderBy("search_rank", "ASC");

        query.setParameters({
            exactSearch: normalizedSearch,
            startsSearch: `${normalizedSearch}%`
        });

    }

    applySelectors(alias: string, params: SearchParams, query: SelectQueryBuilder<Tax>): void {
        query
            .select([
                `${alias}.id`,
                `${alias}.createdAt`,
                `${alias}.alias`,
                `${alias}.percentage`,
                `${alias}.amount`,
                `${alias}.valueType`,
                `${alias}.countryCode`,
                `${alias}.localityCode`,
                `${alias}.stateCode`,
                `${alias}.jurisdiction`,
            ])
    }

    search(alias: string, params: SearchParams) {
        const query = this.repo.createQueryBuilder(alias);

        this.applySelectors(
            alias,
            params,
            query
        )
        this.applyJoins(
            alias,
            params,
            query
        )
        this.applyFilters(
            alias,
            params,
            query
        )

        return query.getMany();
    }

    get(params: SearchParams) {

        const {
            hideProjectFilter,
            projectId,
            countryProfileId,
            ...rest
        } = params;

        const shouldHideProject = hideProjectFilter && countryProfileId;

        const finalParams = {
            countryProfileId,
            ...rest,
            ...(!shouldHideProject ? {} : { projectId })
        };

        return this.search(
            "tax",
            finalParams
        )
    }

    async getById(id: string) {
        return this.repo.createQueryBuilder(
            "tax"
        )
            .leftJoin("tax.countryProfile", "countryProfile")
            .where("tax.id = :id", { id })
            .loadAllRelationIds({
                relations: ["ownerProfile"]
            })
            .addSelect([
                "tax.alias",
                "tax.denomination",
                "tax.authorityReferenceCode",
                "tax.percentage",
                "tax.amount",
                "tax.valueType",
                "tax.countryCode",
                "tax.stateCode",
                "tax.localityCode",
                "tax.jurisdiction",
                "tax.metadata",
                "tax.definitionType",

                "countryProfile.countryName",
                "countryProfile.countryCode",
                "countryProfile.authorityName"
            ])
            .getOne();
    }
}