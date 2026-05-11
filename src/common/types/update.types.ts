import { DeepPartial } from "typeorm"

export type UpdatePayload<T> = {
    old : T,
    new : T
}