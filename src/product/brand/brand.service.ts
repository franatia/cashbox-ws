import { DeepPartial, FindOptionsWhere, MissingDeleteDateColumnError, Repository } from "typeorm";
import CreateDto from "./dto/create.dto";
import { buildSlug } from "@/common/helpers/slug.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Brand } from "../entities/brand.entity";
import UpdateDto from "./dto/update.dto";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    name ?: string,
    description?: string,
    logoUrl?: string,
    slug?: string
}

type PrepareOrmParams = {
    name?: string,
    description?: string,
    logoUrl?: string,
}

@Injectable()
export class BrandService {

    constructor(

        @InjectRepository(Brand)
        private readonly repo: Repository<Brand>

    ) { }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * Guarda el brand en DB
     * 
     * @param orm 
     * @returns 
     */

    async saveOne(
        orm: DeepPartial<Brand>
    ): Promise<Brand> {

        return this.repo.save(orm);

    }

    /**
     * 
     * UPDATERS
     * 
     */

    async updateOne(
        brandId : string,
        orm : DeepPartial<Brand>
    ){

        const {raw, affected} = await this.repo.update(
            brandId,
            orm
        )

        if(!affected){
            throw new BadRequestException("Brand was not found");
        }

        return this.repo.merge(
            new Brand(),
            raw[0]
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param options 
     * @returns 
     */

    async deleteOne(
        options : FindOptionsWhere<Brand>
    ){
        return this.repo.delete(options);
    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * Maqueta el brand orm
     * 
     * @param param0 
     * @returns 
     */

    makeOrm({
        name,
        description,
        logoUrl,
        slug
    }: OrmParams
    ): DeepPartial<Brand> {

        return {
            name,
            description,
            logoUrl,
            slug
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    prepareOrm(
        params : PrepareOrmParams
    ){

        const {name} = params;

        return this.makeOrm({
            ...params,
            ...(name && {slug : buildSlug(name)})
        })

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * Crea el brand
     * 
     * @param dto 
     * @returns 
     */

    async create(
        dto: CreateDto
    ) {

        const {
            name,
            description
        } = dto;

        const slug = buildSlug(name);

        const orm = this.makeOrm({
            name,
            description,
            slug
        })

        const brand = await this.saveOne(orm);

        return brand;

    }

    /**
     * 
     * put
     * 
     */

    async put(
        brandId : string,
        dto: UpdateDto
    ) {

        const orm = this.prepareOrm(dto);

        return this.updateOne(
            brandId,
            orm
        )

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     * @param brandId 
     * @returns 
     */

    async delete(
        brandId : string
    ){
        return this.deleteOne({
            id : brandId
        })
    }

}