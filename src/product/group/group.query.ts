import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "../entities/group.entity";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { buildSlug } from "@/common/helpers/entities/slug.helper";
import { notObjectEmpty } from "@/common/helpers/object.helper";

/**
 * 
 * ORM PARAMS
 * 
 */

type OrmParams = {
    projectId?: string,
    productsId?: string[]
    parentGroupId?: string,
    name?: string,
    slug?: string,
    level?: number,
    path?: string,
    visibility?: boolean
}

type PrepareOrmParams = {
    projectId?: string,
    productsId?: string[],
    name?: string,
    parentGroupId?: string,
    visibility?: boolean,
    id?: string,
}

type PrepareUpdateOrmParams = {
    name?: string,
    slug?: string,
    productsId?: string[],
    parentGroupId?: string,
    id?: string
}

@Injectable()
export default class GroupQuery {

    constructor(
        @InjectRepository(Group)
        private readonly repo: Repository<Group>,
    ) { }


    /**
     * 
     * QUERY
     * 
     */

    /**
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    findOne(
        options: FindOneOptions<Group>
    ): Promise<Group | null> {
        return this.repo.findOne(options)
    }

    /**
     * 
     * @param where 
     * @param select 
     * @returns 
     */

    async findOneOrFail(
        options: FindOneOptions<Group>
    ): Promise<Group> {

        const productGroup = await this.findOne(options)

        if (!productGroup) {
            throw new BadRequestException("Product Group does not exists");
        }

        return productGroup;

    }

    /**
     * 
     * EXISTS
     * 
     */

    exists(
        where: FindOptionsWhere<Group>
    ) {
        return this.repo.exists({
            where
        });
    }

    /**
     * 
     * SAVERS
     * 
     */

    /**
     * 
     * Guarda el product group
     * 
     * @param orm 
     * @returns 
     */

    async saveOne(
        params: OrmParams
    ): Promise<Group> {

        notObjectEmpty(params);

        const orm = await this.prepareOrm({
            ...params
        });

        const productGroup = await this.repo.save(orm);

        return productGroup;

    }

    /**
     * 
     * UPDATERS
     * 
     */

    async updateOne(
        groupId: string,
        params: PrepareUpdateOrmParams,
        returning: string[] | string = "*"
    ): Promise<Group> {

        notObjectEmpty(params);

        const {
            productsId,
            ...rest
        } = params;

        if (productsId?.length) {
            await this.setProducts(groupId, productsId);
        }

        const orm = await this.prepareOrm({
            ...rest
        });

        const { raw } = await this.repo.createQueryBuilder()
            .update(Group)
            .set(orm)
            .where("id = :groupId", { groupId })
            .returning(returning)
            .execute();

        const group = this.repo.merge(
            new Group(),
            raw[0]
        );

        return group;

    }

    /**
     * 
     * DELETE
     * 
     */

    delete(
        where: FindOptionsWhere<Group>
    ) {
        return this.repo.delete(where);
    }

    /**
     * 
     * SUBQUERY
     * 
     */

    filterByPathSq(
        path: string
    ) {

        return this.repo.createQueryBuilder()
            .subQuery()
            .from(Group, "filterPathGroup")
            .where("filterPathGroup.path ILIKE :filterPathGroupSearchText", {
                filterPathGroupSearchText: `%${path}%`
            })
            .select("filterPathGroup.id")

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
    * 
    * @param groupId 
    * @param productsId 
    * @returns 
    */

    async setProducts(
        groupId: string,
        productsId: string[]
    ) {

        const { products } = await this.findOneOrFail({
            where: {
                id: groupId
            },
            loadRelationIds: {
                relations: ["products"]
            }
        })

        const currentProductsId = products.map(product => String(product));
        const addProductsId = productsId.filter(id => !currentProductsId.includes(id));
        const removeProductsId = currentProductsId.filter(id => !productsId.includes(id));

        const promises: Promise<any>[] = [];

        if (addProductsId.length) {
            promises.push(
                this.addProducts(groupId, addProductsId)
            )
        }
        if (removeProductsId.length) {
            promises.push(
                this.removeProducts(groupId, removeProductsId)
            )
        }

        await Promise.all(promises);

    }

    /**
     * 
     * @param groupId 
     * @param productsId 
     * @returns 
     */

    addProducts(
        groupId: string,
        productsId: string[]
    ) {
        return this.repo
            .createQueryBuilder()
            .relation(Group, "products")
            .of(groupId)
            .add(productsId);
    }

    /**
     * 
     * @param groupId 
     * @param productsId 
     * @returns 
     */

    removeProducts(
        groupId: string,
        productsId: string[]
    ) {
        return this.repo
            .createQueryBuilder()
            .relation(Group, "products")
            .of(groupId)
            .remove(productsId);
    }

    /**
     * 
     * @param groupId 
     * @param oldPath 
     * @returns 
     */

    async savePathAndLevel(
        groupId: string,
        parentGroupId?: string
    ) {

        return this.updateOne(
            groupId,
            {
                id: groupId,
                parentGroupId
            }
        );

    }

    /**
     * 
     * ORM
     * 
     */

    /**
     * 
     * Crea el orm del product group
     * 
     * @param param0 
     * @returns 
     */

    private makeOrm(
        params: OrmParams
    ): DeepPartial<Group> {

        const {
            projectId,
            productsId,
            parentGroupId,
            name,
            ...rest
        } = params;

        const orm: DeepPartial<Group> = {
            ...rest
        }

        if (name) {
            orm.name = name;
        }

        if (productsId?.length) {
            orm.products = productsId.map(id => ({ id }))
        }

        if (projectId) {
            orm.project = {
                id: projectId
            }
        }

        if (parentGroupId) {
            orm.parentGroup = {
                id: parentGroupId
            }
        }

        return orm;

    }

    /**
     * 
     * @param projectId 
     * @param productsId 
     * @param name 
     * @param slug 
     * @param parentGroupId 
     * @returns 
     */

    private async prepareOrm(
        prepareParams : PrepareOrmParams
    ) {

        const {
            name,
            projectId,
            productsId,
            parentGroupId,
            id
        } = prepareParams;

        const params: OrmParams = {
            projectId,
            productsId,
            name,
            ...(name && ({ slug: buildSlug(name) }))
        }

        if (parentGroupId) {
            await this.applyParentGroupParams(
                prepareParams,
                params
            )
        }else if(id){
            params.path = id;
            params.level = 1;
        }

        return this.makeOrm(params);

    }

    private async applyParentGroupParams(
        params : PrepareOrmParams,
        ormParams : OrmParams
    ) {

        const {
            parentGroupId,
            projectId,
            id
        } = params;

        const {
            level: parentLevel,
            path: parentPath
        } = await this.findOneOrFail({
            where: {
                id: parentGroupId,
                project: {
                    id: projectId
                }
            },
            select: {
                id: true,
                level: true,
                path: true
            }
        })

        ormParams.parentGroupId = parentGroupId;
        ormParams.level = parentLevel + 1;

        const hasId = !!id;
        ormParams.path = (hasId) ? `${parentPath}/${id}` : parentPath;
    }

}