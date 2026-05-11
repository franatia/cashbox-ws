import { IsUUID } from "class-validator";

export default class CreateManyByFeatureGroupDto {

    @IsUUID()
    productId !: string;

    @IsUUID()
    featureGroupId !: string;

}