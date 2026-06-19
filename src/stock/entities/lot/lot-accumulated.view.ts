import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { LotStatus, LotType } from "@/stock/enums/lot.enum";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    schema : DatabaseSchemas.stock,
    name : "lot_accumulated",
    expression : `
        SELECT
            id,
            remaining,
            quantity,
            "createdAt",
            status,
            type,
            "expiresAt",
            "reserveId",
            "stockItemId",
            SUM(remaining) OVER (
                ORDER BY "createdAt"
            ) AS "remainingAccumulated",
            SUM(quantity) OVER (
                ORDER BY "createdAt"
            ) AS "quantityAccumulated"
        FROM stock.lots
    `
})
export class LotAccumulatedView {

    @ViewColumn()
    id !: string;

    @ViewColumn()
    remainingAccumulated !: number;

    @ViewColumn()
    quantityAccumulated !: number;

    @ViewColumn()
    remaining !: number;

    @ViewColumn()
    quantity !: number;

    @ViewColumn()
    status !: LotStatus;
    
    @ViewColumn()
    type !: LotType;

    @ViewColumn()
    reserveId !: string;

    @ViewColumn()
    stockItemId !: string;

    @ViewColumn()
    createdAt !: Date;

    @ViewColumn()
    expiresAt !: Date;

}