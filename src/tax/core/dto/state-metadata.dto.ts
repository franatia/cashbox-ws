import { State, StateList } from "@/common/enum/jurisdiction/state.enum";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class StateMetadataDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    stateName ?: string;

    @IsOptional()
    @IsIn(StateList)
    stateCode ?: State

}