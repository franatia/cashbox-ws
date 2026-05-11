import { Group } from "../entities/group.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import CreateDto from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import GroupQuery from "./group.query";

@Injectable()
export class GroupService {

    constructor(

        private readonly query: GroupQuery

    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    /**
   * 
   * Verifica si el product group esta vinculado
   * al proyecto
   * 
   * @param productGroupId 
   * @param projectId 
   * @param throwable 
   * @returns 
   */

    async linkedToProject(
        productGroupId: string,
        projectId: string,
        throwable: boolean = true
    ) {

        const exists = await this.query.exists({
            id: productGroupId,
            project: {
                id: projectId
            }
        })

        if (!exists && throwable) throw new BadRequestException("Product group is not linked with the project");

        return exists;

    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
       * 
       * Crea un grupo de productos
       * 
       * @param CreateDto 
       */

    async create(
        projectId: string,
        dto: CreateDto
    ): Promise<Group> {

        /**
         * 
         * Crear product group
         * 
         */

        const {
            parentGroupId,
            ...rest
        } = dto;

        const { id } = await this.query.saveOne({
            projectId,
            ...rest
        });

        const productGroup = await this.query.savePathAndLevel(
            id,
            parentGroupId
        )

        return productGroup;

    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param groupId 
     * @param dto 
     * @returns 
     */

    put(
        groupId: string,
        dto: UpdateDto
    ) {

        return this.query.updateOne(
            groupId,
            dto
        );

    }

    /**
     * 
     * DELETE
     * 
     */

    async delete(
        groupId : string
    ){
        await this.query.delete({
            id : groupId
        })

        return {
            "deletedGroup" : groupId
        }
    }

}