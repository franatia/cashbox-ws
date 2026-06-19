import { plainRequest } from "@/common/helpers/http/request.helper";
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import ComplementQuery from "../complement.query";
import { ItemService } from "@/product/item/item.service";
import { In } from "typeorm";
import {ItemQuery} from "@/product/item/item.query";
import { isUUID } from "class-validator";

type Payload = {
    complementId?: string,
    itemsId?: string[],
    productId?: string
}

@Injectable()
export class VerifyComplementItemsGuard implements CanActivate {

    constructor(
        private readonly query: ComplementQuery,
        private readonly itemService: ItemService,
        private readonly itemQuery: ItemQuery
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const payload = plainRequest(request) as Payload

        await this.validatePayload(payload);

        const {
            complementId,
            itemsId,
            productId
        } = payload;

        if (productId && itemsId?.length) {
            await this.notLinkedProduct(
                productId,
                itemsId
            )
        } else if (complementId && itemsId?.length) {

            await this.notIncludeItems(
                complementId,
                itemsId
            )

            await this.notLinkedComplementProduct(
                complementId,
                itemsId
            )

        } else {
            return false;
        }

        return true;

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param productId 
     * @param itemsId 
     */

    private async notLinkedProduct(
        productId: string,
        itemsId: string[]
    ) {
        await this.itemService.manyNotLinkedToProduct(
            itemsId,
            productId
        )
    }

    /**
     * 
     * @param complementId 
     * @param itemsId 
     */

    private async notLinkedComplementProduct(
        complementId: string,
        itemsId: string[]
    ) {
        const productId = await this.getProductIdByComplement(complementId);

        this.notLinkedProduct(
            productId,
            itemsId
        )
    }

    /**
     * 
     * @param complementId 
     * @param itemsId 
     */

    private async notIncludeItems(
        complementId: string,
        itemsId: string[]
    ) {
        const count = await this.query.countItem({
            complement: {
                id: complementId
            },
            item: {
                id: In(itemsId)
            }
        })

        if (count > 0) {
            throw new BadRequestException("Some items are already added");
        }
    }

    private async getProductIdByComplement(
        complementId: string
    ) {
        const { product } = await this.query.findOneOrFail({
            where: {
                id: complementId
            },
            loadRelationIds: {
                relations: ["product"]
            }
        })

        const productId = String(product);

        return productId;
    }

    /**
     * 
     * VALIDATORS
     * 
     */

    /**
     * 
     * @param payload 
     */

    private async validatePayload(
        payload: Payload
    ) {

        this.validateEntries(payload);
        this.validatePayloadValues(payload);

        const {
            itemsId
        } = payload;

        if (itemsId?.length) {
            await this.verifyItemsExistence(itemsId);
        }

    }

    private validateEntries(
        payload: Payload
    ) {
        const keys = Object.keys(payload);

        if (!keys.includes("itemsId") || !payload.itemsId?.length) {
            throw new BadRequestException("Items id are empty");
        }


        if (!keys.includes("complementId") && !keys.includes("productId")) {
            throw new BadRequestException("Complement id or product id are required");
        }

        if (keys.includes("complementId") && keys.includes("productId")) {
            throw new BadRequestException("Just need complement id or product id");
        }

    }

    private validatePayloadValues(
        {
            complementId,
            itemsId,
            productId
        }: Payload
    ) {
        if(itemsId?.some(itemId => !isUUID(itemId, "4"))){
            throw new BadRequestException("Some item id is not a uuid value");
        }

        if (complementId && !isUUID(complementId, "4")) {
            throw new BadRequestException("Complement id is not a uuid value");
        }

        if (productId && !isUUID(productId, "4")) {
            throw new BadRequestException("Product id is not a uuid value");
        }
    }

    private async verifyItemsExistence(
        items: string[]
    ) {
        const count = await this.itemQuery.count({
            id: In(items)
        });

        if (count !== items.length) {
            throw new BadRequestException("Some items does not exists");
        }

    }

}