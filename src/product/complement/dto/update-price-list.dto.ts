import { IsUUID } from "class-validator";

export default class UpdatePriceListDto {
    @IsUUID()
    priceListId !: string
}