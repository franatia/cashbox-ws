import {BaseService} from "@/common/models/crud/base-service.crud";
import { CreateParams, ResolveAdditionParams, ResolveMovementParams, ResolveSubtractionParams } from "./types/params/service.params";
import { MovementQuery } from "./movement.query";
import { ItemService } from "../item/item.service";
import { MovementFactory } from "./movement.factory";
import { SaveParams } from "./types/params/query.params";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AdditionReason, AdditionReasonList, SubtractionReason, SubtractionReasonList } from "./types/reason.type";
import { LotMovementPayload } from "./types/payloads/lot.payloads";
import { OperationDirection } from "@/common/enum/operation.enum";
import { MovementReason } from "../enums/movement.enum";

@Injectable()
export class MovementService implements BaseService {

    constructor(
        private readonly query: MovementQuery,
        private readonly factory: MovementFactory,

        private readonly itemService: ItemService
    ) { }

    /**
     * 
     * @param params 
     * @returns 
     */

    async create(
        params: CreateParams
    ) {

        const {
            stockItemId,
            transferItemId,
            userCreatorId,
            lots,

            reason,
            direction,
            quantity,

            lotStatus,
            lotType,
        } = params;

        const movementPayload = await this.resolveMovement({
            stockItemId,
            direction,
            quantity,
            lots,
            lotStatus,
            lotType,
            reason
        });

        const saveParams: SaveParams[] = movementPayload.map(({
            lotId,
            quantity: lotQuantity
        }) => ({
            stockItemId,
            transferItemId,
            userCreatorId,
            lotId,

            quantity: lotQuantity,
            direction,
            reason,
        }));

        return this.query.saveMany(
            saveParams
        );

    }

    /**
     * 
     * DELETE
     * 
     */

    /**
     * 
     */

    delete() { }

    /**
     * 
     * RESOLVERS
     * 
     */

    /**
     * 
     * @param params 
     * @returns 
     */

    private resolveMovement(
        params: ResolveMovementParams
    ) {

        const {
            stockItemId,
            lots,

            quantity,
            reason,
            direction,

            lotStatus,
            lotType
        } = params;

        if (direction === OperationDirection.OUT) {

            this.validateReasonByDirection(
                reason,
                direction
            )

            return this.resolveSubtraction({
                stockItemId,
                lots,

                quantity,
                reason: reason as SubtractionReason,
                lotStatus,
                lotType
            })

        } else if (direction === OperationDirection.IN) {

            this.validateAdditionParams(
                params
            );

            return this.resolveAddition({
                reason: reason as AdditionReason,
                lots: lots!
            })

        }

        throw new BadRequestException(
            "Direction value provided is invalid"
        );

    }

    /**
     * 
     * @param params 
     */

    private async resolveSubtraction(
        params: ResolveSubtractionParams
    ) {

        const subtractions = await this.resolveSubtractionReason(
            params
        )

        return this.factory.parseLotSubtractionToMovementPayload(
            subtractions
        );

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private resolveSubtractionReason(
        params: ResolveSubtractionParams
    ) {
        const {
            reason,
            stockItemId,
            ...rest
        } = params;


        switch (reason) {
            case MovementReason.SELL:
            case MovementReason.PRODUCTION:
            case MovementReason.FULFILLED_RESERVE:
                return this.itemService.subtractRemaining(
                    stockItemId,
                    rest
                );

            case MovementReason.WITHDRAWAL:
            case MovementReason.TRANSFER:
                return this.itemService.subtractQuantity(
                    stockItemId,
                    rest
                );

            default:
                throw new BadRequestException(
                    "The movement transaction has to have a valid reason"
                );
        }

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private async resolveAddition(
        params: ResolveAdditionParams
    ): Promise<LotMovementPayload[]> {

        const additions = await this.resolveAdditionReason(
            params
        );

        return this.factory.parseLotAdditionToMovementPayload(
            additions
        );

    }

    /**
     * 
     * @param params 
     * @returns 
     */

    private resolveAdditionReason(
        params: ResolveAdditionParams
    ) {
        const {
            reason,
            lots,
        } = params;

        switch (reason) {
            case MovementReason.REFUND:
                return this.itemService.addRemaining(
                    lots
                );
            case MovementReason.TRANSFER:
            case MovementReason.RECEIPT:
                return this.itemService.addQuantity(
                    lots
                );
            default:
                throw new BadRequestException(
                    "The movement transaction has to have a valid reason"
                );
        }

    }

    /**
     * 
     * VALIDATORS
     * 
     */

    private validateReasonByDirection(
        reason: MovementReason,
        direction: OperationDirection
    ) {

        let includes = false;

        if (direction === OperationDirection.IN) {

            includes = SubtractionReasonList.includes(
                reason
            );

        } else if (
            direction === OperationDirection.OUT
        ) {

            includes = AdditionReasonList.includes(
                reason
            );

        }

        if (!includes) {
            throw new BadRequestException(
                "Reason is invalid for direction provided"
            );
        }
    }

    /**
     * 
     * @param params 
     */

    private validateAdditionParams(
        params: ResolveMovementParams
    ) {
        const {
            reason,
            direction,
            lots
        } = params;

        if (!lots?.length) {

            throw new BadRequestException(
                "Lots params are required to create an IN reason movement"
            );

        };

        this.validateReasonByDirection(
            reason,
            direction
        );

    }

}