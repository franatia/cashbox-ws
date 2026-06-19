import { DeepPartial } from "typeorm";
import Tax from "../entities/tax.entity";
import { OrmParams } from "../core/tax.query";
import { TaxJurisdiction } from "../enums/jurisdiction.enum";
import { BadRequestException } from "@nestjs/common";

export const applyJurisdiction = (
    target : DeepPartial<Tax> | Tax | OrmParams
) => {
    const {
        country,
        state,
        locality,
        jurisdiction
    } = target;

    const isCountry = !!country;
    const isState = isCountry && !!state;
    const isLocality = isState && !!locality;
    const changeJurisdiction =
        (jurisdiction === TaxJurisdiction.INTERNAL || jurisdiction === TaxJurisdiction.OTHER)
            ? false
            : true;
    let currentJurisdiction: TaxJurisdiction | undefined = undefined;

    if (isLocality) {
        currentJurisdiction = TaxJurisdiction.LOCALITY;
    }
    if (isState && !currentJurisdiction) {
        currentJurisdiction = TaxJurisdiction.STATE;
        target.locality = null;
    }
    if (isCountry && !currentJurisdiction) {
        currentJurisdiction = TaxJurisdiction.COUNTRY;
        target.state = null;
        target.locality = null;
    }

    if (changeJurisdiction) {
        target.jurisdiction = currentJurisdiction;
    }

    if (!target.jurisdiction) {
        throw new BadRequestException("Tax require jurisdiction");
    }
}