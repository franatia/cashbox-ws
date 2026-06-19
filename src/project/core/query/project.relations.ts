import { ProjectFinder } from "./project.finder";
import {BaseRelations} from "@/common/models/crud/base-relations.crud";
import { Project } from "../../entities/project.entity";
import { ProjectQuery } from "./project.query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectRelations extends BaseRelations<
    Project,
    ProjectQuery,
    ProjectFinder
> {

    constructor(
        finder: ProjectFinder
    ) {
        super(finder);
    }

    /**
     * 
     * @param id 
     * @param ownerId 
     * @param throwable 
     * @returns 
     */

    async linkedToOwner(
        id: string,
        ownerId: string,
        throwable: boolean = true
    ) {

        return this.linkedTo(
            () => {
                return this.finder.existsByOwnerId(
                    id,
                    ownerId
                );
            },
            "Project is not linked with given owner",
            throwable
        )

    }

}