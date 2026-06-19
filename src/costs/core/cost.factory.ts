import { Injectable } from "@nestjs/common";
import { ItemInputData } from "../rule/types/items.types";

@Injectable()
export class CostFactory {
    
    mapItemInputDataById(
        inputData : ItemInputData[] = []
    ){
        const map = new Map<string, ItemInputData>();

        for(const data of inputData){

            const {
                id
            } = data;

            if(map.has(id)) continue;

            map.set(id, data);

        }

        return map;

    }

}