import { BaseUpdater } from "@/common/models/crud/query/base-updater.crud";
import { NodeQuery } from "./node.query";
import { UpdateParams } from "../types/param/query.param";
import { Node } from "@/project/entities/node.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeUpdater extends BaseUpdater<
    Node,
    UpdateParams,
    NodeQuery
> {

    constructor(
        query : NodeQuery
    ){
        super(query);
    }

}