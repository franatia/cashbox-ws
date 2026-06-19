import { BaseSaver } from "@/common/models/crud/query/base-saver.crud";
import { NodeQuery } from "./node.query";
import { SaveParams } from "../types/param/query.param";
import { Node } from "@/project/entities/node.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NodeSaver extends BaseSaver<
    Node,
    SaveParams,
    NodeQuery
> {

    constructor(
        query : NodeQuery
    ){
        super(query);
    }
}