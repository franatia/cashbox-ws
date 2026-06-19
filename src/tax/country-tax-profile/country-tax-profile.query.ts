import {BaseQuery} from "@/common/models/crud/query/base-query.crud";
import CountryTaxProfile from "../entities/country-tax-profile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Country } from "@/common/enum/jurisdiction/country.enum";
import { Injectable } from "@nestjs/common";

type OrmParams = {
    id ?: string;
    countryName ?: string;
    countryCode ?: Country;
    authorityName ?: string;
}

@Injectable()
export default class CountryTaxProfileQuery extends BaseQuery<CountryTaxProfile> {

    constructor(
        @InjectRepository(CountryTaxProfile)
        repo : Repository<CountryTaxProfile>
    ){
        super(CountryTaxProfile, repo);
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
        const orm : DeepPartial<CountryTaxProfile> = params;
        return orm;
    }

}