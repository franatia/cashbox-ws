import { BadRequestException, CanActivate, ExecutionContext, Injectable, mixin, Type } from "@nestjs/common";
import { Observable } from "rxjs";
import { ItemGroupService } from "../item-group.service";
import { plainRequest } from "@/common/helpers/http/request.helper";
import { ItemGroupType } from "@/product/entities/item-group.entity";
import { isUUID } from "class-validator";
import { extractFromRequestByPath } from "@/access/helpers/request";

export function ItemGroupTypeGuard(
    keyId : string,
    ...types : ItemGroupType[]
): Type<CanActivate> {

    @Injectable()
    class InternalGuard implements CanActivate {

        constructor(
            private readonly service: ItemGroupService
        ) { }

        async canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest();
            const payload = plainRequest(request);
            const extraction = extractFromRequestByPath(payload, keyId);
            const id = extraction[0];
            
            if(!isUUID(id)){
                throw new BadRequestException("Item group id is not an uuid value");
            }

            const has = await this.service.hasTypes(
                id,
                ...types
            )

            if(!has){
                throw new BadRequestException("Item group with the id provided not includes the required types");
            }

            return true;

        }
    }

    return mixin(InternalGuard)

}

export function NotFeatureGroupType(
    keyId : string
){
    return ItemGroupTypeGuard(
        keyId,
        ItemGroupType.FEATURES,
        ItemGroupType.ITEMS
    )
}

export function IsFeatureGroupType(
    keyId : string
){
    return ItemGroupTypeGuard(
        keyId,
        ItemGroupType.FEATURE_GROUP
    )
}

export function IsItemsType(
    keyId : string
){
    return ItemGroupTypeGuard(
        keyId,
        ItemGroupType.ITEMS
    )
}

export function IsFeaturesType(
    keyId : string
){
    return ItemGroupTypeGuard(
        keyId,
        ItemGroupType.FEATURES
    )
}