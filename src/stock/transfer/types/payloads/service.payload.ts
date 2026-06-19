import { Transfer } from "@/stock/entities/transfer/transfer.entity"
import { DeepPartial } from "typeorm"

export type CreatePayload = DeepPartial<Transfer>