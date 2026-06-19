import { BaseDeleter } from "@/common/models/crud/query/base-deleter.crud";
import { NodeQuery } from "./node.query";
import { Injectable } from "@nestjs/common";
import { OrmParams } from "../types/param/query.param";
import { Node } from "@/project/entities/node.entity";

@Injectable()
export class NodeDeleter extends BaseDeleter<
    Node,
    OrmParams,
    NodeQuery
> {

    constructor(
        query : NodeQuery
    ){
        super(query);
    }

}