import { Type } from "class-transformer";
import InputDataDto from "./input-data.dto";
import { IsDefined, IsOptional, ValidateNested } from "class-validator";
import { ArrayValidator } from "@/common/decorators/validator/array.validator";
import ProductItemDto from "./product-item.dto";
import { ApiProperty } from "@nestjs/swagger";

export default class CalculateDto {

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @Type(() => ProductItemDto)
    productItem !: ProductItemDto
    
    @ArrayValidator({
        optional : true
    })
    @IsOptional()
    @ValidateNested({each : true})
    @Type(() => InputDataDto)
    inputData ?: InputDataDto[]

}