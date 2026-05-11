import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { CreateFeatureSchemaDto } from "./dto/create.dto";
import { CreateFeatureSchemaItemsDto } from "./dto/create-items.dto";
import { FeatureSchema } from "./entities/feature-schema.entity";
import { FeatureSchemaItem } from "./entities/feature-schema-item.entity";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    name: string,
    projectId: string
}

type ItemOrmParams = {
    schemaId: string,
    value: string
}

type ItemsOrmParams = {
    schemaId: string,
    values: string[]
}

@Injectable()
export class FeatureSchemaService {

    constructor(

        @InjectRepository(FeatureSchema)
        private readonly repo: Repository<FeatureSchema>,

        @InjectRepository(FeatureSchemaItem)
        private readonly itemRepo: Repository<FeatureSchemaItem>

    ) { }

    /**
     * 
     * SAVERS
     * 
     */


    /**
     * 
     * @param orm 
     * @returns 
     */

    async saveOne(
        orm: DeepPartial<FeatureSchema>
    ): Promise<FeatureSchema> {
        return this.repo.save(orm);
    }

    /**
     * 
     * @param orm 
     * @returns 
     */

    async saveItem(
        orm: DeepPartial<FeatureSchemaItem>
    ): Promise<FeatureSchemaItem> {
        return this.itemRepo.save(orm);
    }

    /**
     * 
     * @param orm 
     * @returns 
     */

    async saveItems(
        orm: DeepPartial<FeatureSchemaItem>[]
    ): Promise<FeatureSchemaItem[]> {
        return this.itemRepo.save(orm);
    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * 
     * 
     * @param param0 
     * @returns 
     */

    makeOrm({
        name,
        projectId
    }: OrmParams
    ): DeepPartial<FeatureSchema> {

        return {
            name,
            project: {
                id: projectId
            }
        }

    }

    /**
     * 
     * @param param0 
     * @returns 
     */

    makeItemOrm({
        schemaId,
        value
    }: ItemOrmParams
    ): DeepPartial<FeatureSchemaItem> {

        return {
            schema: {
                id: schemaId
            },
            value
        }

    }

    /**
     * 
     * @param param0 
     * @returns 
     */

    makeItemsOrm({
        schemaId,
        values
    }: ItemsOrmParams
    ): DeepPartial<FeatureSchemaItem>[] {

        return values.map(value => this.makeItemOrm({
            schemaId,
            value
        }))

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param dto 
     * @returns 
     */

    async create(
        dto: CreateFeatureSchemaDto
    ) {

        const {
            name,
            values,
            projectId
        } = dto;

        const orm = this.makeOrm({
            name, projectId
        })

        const schema = await this.saveOne(orm);

        const featureSchemaItems = await this.createItems({
            schemaId : schema.id,
            values
        })

        return {
            schema,
            items : featureSchemaItems
        }

    }

    /**
     * 
     * 
     * 
     * @param dto 
     * @returns 
     */

    async createItems(
        dto : CreateFeatureSchemaItemsDto
    ){ 

        const orm = this.makeItemsOrm(dto);

        const items = await this.saveItems(orm);

        return items;

    }

}