import {BaseService} from "@/common/models/crud/base-service.crud";
import { TransferItemQuery } from "./transfer-item.query";
import { CreateMovementsLinkerParams, CreateMovementsParams, CreateParams, CreateSourceMovementsParams, CreateTargetMovementsParams, ResolveMovementsParams, ResolveSourceMovementsParams, ResolveTargetMovementsParams } from "./types/params/service.params";
import { TransferQuery } from "../transfer/transfer.query";
import { ItemQuery } from "../item/item.query";
import { CreateTargetLotPayload, GetStockItemsPayload, MovementPayload, ResolveCreateTargetLotsPayload, ResolveTargetMovementsPayload, SourceMovementPayload, TargetMovementPayload } from "./types/payload/service.payload";
import { MovementService } from "../movement/movement.service";
import { MovementReason } from "../enums/movement.enum";
import { OperationDirection } from "@/common/enum/operation.enum";
import { TransferItemFactory } from "./transfer-item.factory";
import { LotService } from "../lot/lot.service";
import { MovementsLinkerService } from "../movements-linker/movements-linker.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TransferItemService implements BaseService {

    constructor(
        private readonly query: TransferItemQuery,
        private readonly factory: TransferItemFactory,

        private readonly transferQuery: TransferQuery,
        private readonly itemQuery: ItemQuery,
        private readonly lotService: LotService,
        private readonly movementService: MovementService,

        private readonly movementsLinkerService: MovementsLinkerService
    ) { }

    /**
     * 
     * @param params 
     * @returns 
     */

    async create(
        params: CreateParams
    ) {

        const transferItem = await this.query.saveOne(
            params
        );

        const movements = await this.resolveMovements({
            ...params,
            itemId: transferItem.id
        })

        return {
            ...transferItem,
            movements
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async createMovements(
        params: CreateMovementsParams
    ) {

        const {
            sourceStockItemId,
            targetStockItemId,
            ...rest
        } = params;

        const sourceMovements = await this.createSourceMovements({
            ...rest,
            stockItemId: sourceStockItemId
        });

        const {
            movements: targetMovements,
            lotPayloads
        } = await this.resolveTargetMovements({
            ...rest,
            stockItemId: targetStockItemId,
            sourceMovements: sourceMovements
        });

        return {
            source : sourceMovements,
            target : targetMovements,
            lotPayloads
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async createSourceMovements(
        params: CreateSourceMovementsParams
    ) {

        const {
            itemId,
            ...rest
        } = params;

        const payload = await this.movementService.create({
            ...rest,
            transferItemId: itemId,
            reason: MovementReason.TRANSFER,
            direction: OperationDirection.OUT
        });

        return this.factory.parseToSourceMovementPayloads(
            payload
        );

    }

    private async createMovementsLinkers(
        params: CreateMovementsLinkerParams[]
    ) {

        return this.movementsLinkerService.createMany(params);

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async createTargetMovements(
        params: CreateTargetMovementsParams
    ) {

        const {
            itemId,
            ...rest
        } = params;

        const movements = await this.movementService.create({
            ...rest,
            transferItemId: itemId,
            reason: MovementReason.TRANSFER,
            direction: OperationDirection.IN
        });

        return this.factory.parseToTargetMovementPayloads(movements);

    }

    /**
     * 
     * @param sourceMovements 
     * @param stockItemId 
     * @returns 
     */

    async createTargetLots(
        sourceMovements: SourceMovementPayload[],
        stockItemId: string
    ) {

        const payload: CreateTargetLotPayload[] = [];

        for (const movement of sourceMovements) {
            const lot = await this.createTargetLot(
                movement,
                stockItemId
            );

            payload.push(lot);
        }

        return payload;

    }

    /**
     * 
     * @param payload 
     * @returns 
     */

    private async createTargetLot(
        payload: SourceMovementPayload,
        stockItemId: string,
    ): Promise<CreateTargetLotPayload> {

        const {
            lotId,
            quantity
        } = payload;

        const lot = await this.lotService.createByLotSeed(
            lotId,
            stockItemId
        );

        return {
            lot: {
                id: lot.id,
                quantity
            },
            sourceLot: {
                id: lotId,
                quantity
            }
        }
    }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param itemId 
     * @param lotPayloads 
     * @param sourceMovements 
     * @param targetMovements 
     * @returns 
     */

    resolveMovementsLinkers(
        itemId: string,
        lotPayloads: CreateTargetLotPayload[],
        sourceMovements: SourceMovementPayload[],
        targetMovements: TargetMovementPayload[]
    ) {

        const params = this.prepareMovementsLinkersParams(
            itemId,
            lotPayloads,
            this.factory.mapMovementPayloadsByLotId(
                [
                    ...sourceMovements,
                    ...targetMovements
                ]
            )
        );

        return this.createMovementsLinkers(params);

    }

    prepareMovementsLinkersParams(
        itemId: string,
        lotPayloads: CreateTargetLotPayload[],
        movementsMap: Map<string, MovementPayload>
    ) {

        const params: CreateMovementsLinkerParams[] = [];

        for (const payload of lotPayloads) {

            const {
                lot: targetLot,
                sourceLot
            } = payload;

            const sourceMovement = movementsMap.get(sourceLot.id);
            const targetMovement = movementsMap.get(targetLot.id);

            if (!sourceMovement || !targetMovement) {
                throw new BadRequestException(
                    "Source or target movement does not exists"
                );
            }

            params.push({
                sourceMovementId: sourceMovement.id,
                targetMovementId: targetMovement.id,
                transferItemId: itemId,
                quantity: sourceMovement.quantity
            });

        }

        return params;

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async resolveTargetMovements(
        params: ResolveTargetMovementsParams
    ): Promise<ResolveTargetMovementsPayload> {

        const {
            sourceMovements,
            stockItemId,
            ...rest
        } = params;

        const {
            createPayloads,
            lots
        } = await this.resolveCreateTargetLots(
            sourceMovements,
            stockItemId
        );

        const movements = await this.createTargetMovements({
            ...rest,
            lots,
            stockItemId
        });

        return {
            lotPayloads: createPayloads,
            movements
        }

    }

    /**
     * 
     * @param sourceMovements 
     * @returns 
     */

    private async resolveCreateTargetLots(
        sourceMovements: SourceMovementPayload[],
        stockItemId: string
    ): Promise<ResolveCreateTargetLotsPayload> {

        const payloads = await this.createTargetLots(
            sourceMovements,
            stockItemId
        );

        const lots = payloads.map(p => p.lot);

        return {
            lots,
            createPayloads: payloads
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async resolveMovements(
        params: ResolveMovementsParams
    ) {

        const {
            transferId,
            productItemId,
            ...rest
        } = params;

        const {
            sourceStockItemId,
            targetStockItemId
        } = await this.getStockItems(
            transferId,
            productItemId
        );

        const {
            lotPayloads,
            source : sourceMovements,
            target : targetMovements
        } = await this.createMovements({
            ...rest,
            sourceStockItemId,
            targetStockItemId
        })

        await this.resolveMovementsLinkers(
            params.itemId,
            lotPayloads,
            sourceMovements,
            targetMovements
        );

        return {
            source : sourceMovements,
            target : targetMovements
        }

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param transferId 
     * @returns 
     */

    private async getStockItems(
        transferId: string,
        productItemId: string
    ): Promise<GetStockItemsPayload> {

        const {
            sourceNodeId,
            targetNodeId
        } = await this.transferQuery.getNodesById(transferId);

        const [
            sourceStockItemId,
            targetStockItemId
        ] = await Promise.all([
            this.itemQuery.findAndGetId({
                node: {
                    id: sourceNodeId
                },
                stock: {
                    productItem: {
                        id: productItemId
                    }
                }
            }),
            this.itemQuery.findAndGetId({
                node: {
                    id: targetNodeId
                },
                stock: {
                    productItem: {
                        id: productItemId
                    }
                }
            })
        ])

        return {
            sourceStockItemId,
            targetStockItemId
        }

    }

}