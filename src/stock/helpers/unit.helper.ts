import { BadRequestException } from "@nestjs/common";
import { Operator } from "../enums/operator.enum";
import { ResolveUnitParams, ResolveUnitPayload, VerifyUnitPayload } from "./types/unit.type";

const validateResolveUnitPayload = (payload: VerifyUnitPayload) => {

    const {
        amount,
        quantity,
        remaining,
        currentQuantity,
        currentRemaining
    } = payload;

    if (amount !== undefined && amount < 0) {
        throw new BadRequestException(
            "Amount must to be more or equal than 0"
        )
    }

    if (quantity !== undefined && quantity < 0) {
        throw new BadRequestException(
            "Quantity must to be more or equal than 0"
        )
    }

    if (remaining !== undefined && remaining < 0) {
        throw new BadRequestException(
            "Remaining must to be more or equal than 0"
        )
    }

    if (
        remaining !== undefined &&
        quantity !== undefined
    ) {

        if (remaining > quantity) {
            throw new BadRequestException(
                "Remaining can not be more than quantity"
            );
        }

    }

    if (
        remaining !== undefined &&
        currentQuantity !== undefined &&
        quantity === undefined &&
        remaining > currentQuantity
    ) {
        throw new BadRequestException(
            "Remaining can not be more than quantity"
        );
    }

    if (
        quantity !== undefined &&
        currentRemaining !== undefined &&
        remaining === undefined &&
        quantity < currentRemaining
    ) {
        throw new BadRequestException(
            "Quantity can not be less than remaining"
        );
    }

}

const makeUnitPayload = (params : ResolveUnitParams) => {
    
    const {
        operator,

        quantity,
        currentQuantity,

        amount,
        currentAmount,

        remaining,
        currentRemaining
    } = params;
    
    const payload: ResolveUnitPayload = {};

    switch (operator) {

        case Operator.ADDITION:
            if (quantity) {
                payload.quantity = (currentQuantity ?? 0) + quantity;
            }
            if (amount) {
                payload.amount = (currentAmount ?? 0) + amount;
            }
            if (remaining) {
                payload.remaining = (currentRemaining ?? 0) + remaining;
            }
            break;
        case Operator.SUBTRACTION:
            if (quantity && currentQuantity) {
                payload.quantity = currentQuantity - quantity;
            }
            if (amount && currentAmount) {
                payload.amount = currentAmount - amount;
            }
            if (remaining && currentRemaining) {
                payload.remaining = currentRemaining - remaining;
            }
            break;

    }

    return payload;

}

export const resolveUnitData = (
    params: ResolveUnitParams
) => {

    const {
        currentQuantity,
        currentRemaining
    } = params;

    const payload = makeUnitPayload(params);
    
    validateResolveUnitPayload({
        ...payload,
        currentQuantity,
        currentRemaining
    });
    
    return payload;

}