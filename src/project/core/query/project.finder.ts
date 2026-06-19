import { BaseFinder } from "@/common/models/crud/query/base-finder.crud";
import { ProjectQuery } from "./project.query";
import { Injectable } from "@nestjs/common";
import { Project } from "@/project/entities/project.entity";

@Injectable()
export class ProjectFinder extends BaseFinder<
    Project,
    ProjectQuery
> {

    constructor(
        query: ProjectQuery
    ) {
        super(query);
    }

    /**
     * 
     * @param id 
     * @param ownerId 
     * @returns 
     */

    existsByOwnerId(
        id: string,
        ownerId: string
    ) {

        return this.exists({
            id,
            owner: {
                id: ownerId
            }
        })

    }

}